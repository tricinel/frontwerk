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
  !fileExists('.prettierrc') &&
  !fileExists('prettier.config.js') &&
  !hasPkgProp('prettierrc');

const config = useBuiltinConfig ? ['--config', getConfig('prettierrc.js')] : [];

const useBuiltinIgnore =
  !args.includes('--ignore-path') && !fileExists('.prettierignore');

const ignore = useBuiltinIgnore
  ? ['--ignore-path', getConfig('prettierignore')]
  : [];

const write = args.includes('--no-write') ? [] : ['--write'];

const filesToApply = parsedArgs._.length
  ? []
  : ['**/*.+(js|json|less|css|ts|md)'];

const result = spawn.sync(
  resolveBin('prettier'),
  [...config, ...ignore, ...write, ...filesToApply],
  { stdio: 'inherit' }
);

process.exit(result.status);
