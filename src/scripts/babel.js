const path = require('path');
const spawn = require('cross-spawn');
const rimraf = require('rimraf');
const yargsParser = require('yargs-parser');

const { fromRoot } = require('../utils/fromRoot');
const { resolveBin } = require('../utils/resolveBin');
const { useBuiltinConfig, whichConfig } = require('../utils/whichConfig');
const { start } = require('../utils/logger');

const args = process.argv.slice(2);
const parsedArgs = yargsParser(args);

const config = useBuiltinConfig('babel')
  ? ['--presets', path.join(__dirname, '../config/babelrc.js')]
  : [];

const ignore = args.includes('--ignore')
  ? []
  : ['--ignore', '__tests__,__mocks__'];

const copyFiles = args.includes('--no-copy-files') ? [] : ['--copy-files'];

const useSpecifiedOutDir = args.includes('--out-dir');
const outDir = useSpecifiedOutDir ? [] : ['--out-dir', 'dist'];

const filesGiven = parsedArgs._.length > 0;
const filesToApply = filesGiven ? [] : ['src'];

if (!useSpecifiedOutDir && !args.includes('--no-clean')) {
  rimraf.sync(fromRoot('dist'));
}

start(whichConfig('babel'));

const result = spawn.sync(
  resolveBin('babel-cli', { executable: 'babel' }),
  [...outDir, ...copyFiles, ...ignore, ...config, ...filesToApply].concat(args),
  { stdio: 'inherit' }
);

process.exit(result.status);
