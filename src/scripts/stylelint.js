const spawn = require('cross-spawn');
const yargsParser = require('yargs-parser');

const { getConfig } = require('../utils/getConfig');
const { resolveBin } = require('../utils/resolveBin');
const { fileExists } = require('../utils/fileExists');
const { useBuiltinConfig, whichConfig } = require('../utils/whichConfig');
const { start } = require('../utils/logger');

const args = process.argv.slice(2);
const parsedArgs = yargsParser(args);

const config = useBuiltinConfig('stylelint')
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

start(whichConfig('stylelint'));

const result = spawn.sync(
  resolveBin('stylelint'),
  [...filesToApply, ...config, ...ignore, ...cache, ...color, ...args],
  { stdio: 'inherit' }
);

process.exit(result.status);
