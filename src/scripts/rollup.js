const spawn = require('cross-spawn');
const rimraf = require('rimraf');
const yargsParser = require('yargs-parser');

const { fromRoot } = require('../utils/fromRoot');
const { getConfig } = require('../utils/getConfig');
const { resolveBin } = require('../utils/resolveBin');
const { useBuiltinConfig, whichConfig } = require('../utils/whichConfig');
const { start } = require('../utils/logger');

const rollup = resolveBin('rollup');
const crossEnv = resolveBin('cross-env');

const args = process.argv.slice(2);
const parsedArgs = yargsParser(args);

const hasConfigOption = args.includes('--config');
const emptyConfigOption = hasConfigOption ? '' : '--config';

const config = useBuiltinConfig('rollup')
  ? `--config ${getConfig('rollup.config.js')}`
  : emptyConfigOption;

const watch = parsedArgs.watch ? '--watch' : '';

const cleanBuildDirs = !args.includes('--no-clean');

const environment = parsedArgs.environment
  ? `--environment ${parsedArgs.environment}`
  : '';

if (cleanBuildDirs) {
  rimraf.sync(fromRoot('dist'));
}

const defaultEnv = 'BUILD_ROLLUP=true';

const getCommand = (env, ...flags) =>
  [crossEnv, defaultEnv, env, rollup, config, environment, watch, ...flags]
    .filter(Boolean)
    .join(' ');

const getCommands = (env = '') =>
  ['esm', 'cjs', 'umd', 'umd.min'].reduce((cmds, format) => {
    const [formatName, minify = false] = format.split('.');
    const nodeEnv = minify ? 'production' : 'development';
    const sourceMap = formatName === 'umd' ? '--sourcemap' : '';
    const buildMinify = Boolean(minify);
    cmds[format] = getCommand(
      `BUILD_FORMAT=${formatName} BUILD_MINIFY=${buildMinify} NODE_ENV=${
        nodeEnv
      } ${env}`,
      sourceMap
    );
    return cmds;
  }, {});

const cmds = Object.entries(getCommands()).reduce((all, [name, script]) => {
  if (script) {
    all[name] = script;
  }
  return all;
}, {});

const scripts = [
  '--names',
  Object.keys(cmds).join(','),
  ...Object.values(cmds).map(s => JSON.stringify(s))
].filter(Boolean);

start(whichConfig('rollup'));

const result = spawn.sync(resolveBin('concurrently'), scripts, {
  stdio: 'inherit'
});

process.exit(result.status);
