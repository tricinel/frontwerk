const spawn = require('cross-spawn');
const yargsParser = require('yargs-parser');

const { hasPkgProp } = require('../utils/pkg');
const { getConfig } = require('../utils/getConfig');
const { resolveBin } = require('../utils/resolveBin');
const { fileExists } = require('../utils/fileExists');
const { warning, info } = require('../utils/logger');

let args = process.argv.slice(2);

const parsedArgs = yargsParser(args);

const useBuiltinConfig =
  !args.includes('--config') &&
  !fileExists('.eslintrc') &&
  !fileExists('.eslintrc.js') &&
  !hasPkgProp('eslintConfig');

const config = useBuiltinConfig ? ['--config', getConfig('eslintrc.js')] : [];

const useBuiltinIgnore =
  !args.includes('--ignore-path') &&
  !fileExists('.eslintignore') &&
  !hasPkgProp('eslintIgnore');

const ignore = useBuiltinIgnore
  ? ['--ignore-path', getConfig('eslintignore')]
  : [];

const cache = args.includes('--no-cache') ? [] : ['--cache'];

const filesGiven = parsedArgs._.length > 0;

const filesToApply = filesGiven ? [] : ['.'];

if (filesGiven) {
  // we need to take all the flag-less arguments (the files that should be linted)
  // and filter out the ones that aren't js files. Otherwise json or css files
  // may be passed through
  args = args.filter(
    a => !parsedArgs._.includes(a) || a.endsWith('.js') || a.endsWith('.jsx')
  );
}

// eslintignore is coincidentally ignored, so until this issue is resolved
// we need to make sure the user is not accidentally linting his node_modules
// https://github.com/eslint/eslint/issues/9227
let result;

if (!useBuiltinIgnore) {
  result = spawn.sync(
    resolveBin('eslint'),
    [...config, ...ignore, ...cache, ...args, ...filesToApply],
    { stdio: 'inherit' }
  );
} else {
  warning('Please pass an eslintignore!');
  info(
    'Currently, eslint has issues with reading relative paths.',
    'Until it is resolved, please pass your eslintignore!',
    'See https://github.com/eslint/eslint/issues/9227'
  );
  result = { status: 1 };
}

process.exit(result.status);
