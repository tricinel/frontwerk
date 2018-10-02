const spawn = require('cross-spawn');
const yargsParser = require('yargs-parser');

const { getConfig } = require('../utils/getConfig');
const { resolveBin } = require('../utils/resolveBin');
const { fileExists } = require('../utils/fileExists');
const { useBuiltinConfig, whichConfig } = require('../utils/whichConfig');
const { start } = require('../utils/logger');

const args = process.argv.slice(2);
const parsedArgs = yargsParser(args);

const config = useBuiltinConfig('prettier')
  ? ['--config', getConfig('prettierrc.js')]
  : [];

const useBuiltinIgnore =
  !args.includes('--ignore-path') && !fileExists('.prettierignore');

const ignore = useBuiltinIgnore
  ? ['--ignore-path', getConfig('prettierignore')]
  : [];

const write = args.includes('--no-write') ? [] : ['--write'];

const filesToApply = parsedArgs._.length
  ? parsedArgs._
  : ['**/*.+(js|jsx|json|css|ts|md)'];

start(whichConfig('prettier'));

const result = spawn.sync(
  resolveBin('prettier'),
  [...config, ...ignore, ...write, ...filesToApply],
  { stdio: 'inherit' }
);

process.exit(result.status);
