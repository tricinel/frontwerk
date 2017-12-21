const path = require('path');
const spawn = require('cross-spawn');
const rimraf = require('rimraf');
const yargsParser = require('yargs-parser');

const { hasPkgProp } = require('../utils/pkg');
const { fromRoot } = require('../utils/fromRoot');
const { resolveBin } = require('../utils/resolveBin');
const { fileExists } = require('../utils/fileExists');

const args = process.argv.slice(2);
const parsedArgs = yargsParser(args);

const useBuiltinConfig =
  !args.includes('--presets') &&
  !fileExists('.babelrc') &&
  !hasPkgProp('babel');

const config = useBuiltinConfig
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

const result = spawn.sync(
  resolveBin('babel-cli', { executable: 'babel' }),
  [...outDir, ...copyFiles, ...ignore, ...config, ...filesToApply].concat(args),
  { stdio: 'inherit' }
);

process.exit(result.status);
