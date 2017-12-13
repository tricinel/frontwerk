const path = require('path');
const spawn = require('cross-spawn');
const rimraf = require('rimraf');

const { hasPkgProp } = require('../utils/pkg');
const { fromRoot } = require('../utils/fromRoot');
const { resolveBin } = require('../utils/resolveBin');
const { fileExists } = require('../utils/fileExists');

const args = process.argv.slice(2);

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

if (!useSpecifiedOutDir && !args.includes('--no-clean')) {
  rimraf.sync(fromRoot('dist'));
}

const result = spawn.sync(
  resolveBin('babel-cli', { executable: 'babel' }),
  [...outDir, ...copyFiles, ...ignore, ...config, 'src'].concat(args),
  { stdio: 'inherit' }
);

process.exit(result.status);
