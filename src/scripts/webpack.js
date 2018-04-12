const spawn = require('cross-spawn');
const rimraf = require('rimraf');
const yargsParser = require('yargs-parser');
const mkdirp = require('mkdirp');

const { fromRoot } = require('../utils/fromRoot');
const { getConfig } = require('../utils/getConfig');
const { resolveBin } = require('../utils/resolveBin');
const { start } = require('../utils/logger');
const { useBuiltinConfig, whichConfig } = require('../utils/whichConfig');

const webpack = resolveBin('webpack');
const crossEnv = resolveBin('cross-env');

const args = process.argv.slice(2);
const parsedArgs = yargsParser(args);

const config = useBuiltinConfig('webpack')
  ? `--config ${getConfig('webpack.config.js')}`
  : '';

const watch = parsedArgs.watch ? '--watch' : '';

const environment = parsedArgs.env ? `--env ${parsedArgs.env}` : '';

const entry = args.includes('--entry') ? `BUILD_ENTRY=${parsedArgs.entry}` : '';

const useOutputPath = args.includes('--output-path');
const outputPath = useOutputPath
  ? `BUILD_OUTPUT_PATH=${parsedArgs.outputPath}`
  : '';

const cleanBuildDirs = !args.includes('--no-clean');
const buildDir = useOutputPath ? parsedArgs.outputPath : 'dist';

if (cleanBuildDirs) {
  rimraf.sync(fromRoot(buildDir));
}

mkdirp.sync(fromRoot(buildDir));

const defaultEnv = 'BUILD_WEBPACK=true';

const getWebpackCommand = (env, ...flags) =>
  [
    crossEnv,
    defaultEnv,
    env,
    environment,
    entry,
    outputPath,
    webpack,
    config,
    watch,
    ...flags
  ]
    .filter(Boolean)
    .join(' ');

const script = ['--names', 'webpack', JSON.stringify(getWebpackCommand())];

start(whichConfig('webpack'));

const result = spawn.sync(resolveBin('concurrently'), script, {
  stdio: 'inherit'
});

process.exit(result.status);
