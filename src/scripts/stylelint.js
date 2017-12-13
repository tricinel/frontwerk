const spawn = require('cross-spawn');
const yargsParser = require('yargs-parser');

const { hasPkgProp } = require('../utils/pkg');
const { getConfig } = require('../utils/getConfig');
const { resolveBin } = require('../utils/resolveBin');
const { fileExists } = require('../utils/fileExists');

const args = process.argv.slice(2);
const parsedArgs = yargsParser(args);

const useBuiltinConfig =
  !args.includes('--config') &&
  !fileExists('.stylelintrc') &&
  !fileExists('stylelint.config.js') &&
  !hasPkgProp('stylelint');

const config = useBuiltinConfig
  ? ['--config', getConfig('stylelint.config.js')]
  : [];

const useBuiltinIgnore =
  !args.includes('--ignore-path') && !fileExists('.stylelintignore');

const ignore = useBuiltinIgnore
  ? ['--ignore-path', getConfig('stylelintignore')]
  : [];

const cache = args.includes('--no-cache') ? [] : ['--cache'];
const color = args.includes('--no-color') ? [] : ['--color'];

const filesToApply = parsedArgs._.length ? [] : ['**/*.+(css|sass|scss)'];

const result = spawn.sync(
  resolveBin('stylelint'),
  [...filesToApply, ...config, ...ignore, ...cache, ...color, ...args],
  { stdio: 'inherit' }
);

process.exit(result.status);
