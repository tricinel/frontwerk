import spawn from 'cross-spawn';
import rimraf from 'rimraf';
import yargsParser from 'yargs-parser';

import fromRoot from '../utils/fromRoot';
import getConfig from '../utils/getConfig';
import resolveBin from '../utils/resolveBin';
import { useBuiltinConfig, whichConfig } from '../utils/whichConfig';
import { start } from '../utils/logger';
import safeExit from '../utils/proc';

const rollup = resolveBin('rollup');
const crossEnv = resolveBin('cross-env');

const args = process.argv.slice(2);
const parsedArgs = yargsParser(args);

const hasConfigOption = args.includes('--config');
const emptyConfigOption = hasConfigOption ? '' : '--config';

const config = useBuiltinConfig('rollup')
  ? `--config ${getConfig('rollup.config.js')}`
  : emptyConfigOption;

const watch = typeof parsedArgs.watch === 'undefined' ? '' : '--watch';

const cleanBuildDirs = !args.includes('--no-clean');

const environment =
  typeof parsedArgs.environment === 'undefined'
    ? ''
    : `--environment ${parsedArgs.environment}`;

if (cleanBuildDirs) {
  rimraf.sync(fromRoot('dist'));
}

const defaultEnv = 'BUILD_ROLLUP=true';

const getCommand = (env: string, ...flags: string[]): string =>
  [crossEnv, defaultEnv, env, rollup, config, environment, watch, ...flags]
    .filter(Boolean)
    .join(' ');

interface Commands {
  [cmdName: string]: string;
}

const getCommands = (env = ''): Commands =>
  ['esm', 'cjs', 'umd', 'umd.min'].reduce(
    (cmds: Commands, format): Commands => {
      const [formatName, minify = false] = format.split('.');
      const nodeEnv = typeof minify === 'string' ? 'production' : 'development';
      const sourceMap = formatName === 'umd' ? '--sourcemap' : '';
      const buildMinify = Boolean(minify);
      return {
        ...cmds,
        [format]: getCommand(
          `BUILD_FORMAT=${formatName} BUILD_MINIFY=${buildMinify} NODE_ENV=${nodeEnv} ${env}`,
          sourceMap
        )
      };
    },
    {}
  );

const cmds = Object.entries(getCommands()).reduce(
  (all: Commands, [cmdName, script]) => ({
    ...all,
    ...(typeof script === 'undefined' ? {} : { [cmdName]: script })
  }),
  {}
);

const scripts = [
  '--names',
  Object.keys(cmds).join(','),
  ...Object.values(cmds).map(s => JSON.stringify(s))
].filter(Boolean);

start(whichConfig('rollup'));

const result = spawn.sync(resolveBin('concurrently'), scripts, {
  stdio: 'inherit'
});

safeExit(result.status);
