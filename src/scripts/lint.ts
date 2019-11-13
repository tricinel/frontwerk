import spawn from 'cross-spawn';
import yargsParser from 'yargs-parser';

import { hasPkgProp } from '../utils/pkg';
import getConfig from '../utils/getConfig';
import resolveBin from '../utils/resolveBin';
import fileExists from '../utils/fileExists';
import { warning, info, start } from '../utils/logger';
import { useBuiltinConfig, whichConfig } from '../utils/whichConfig';

let args = process.argv.slice(2);

const parsedArgs = yargsParser(args);

const config = useBuiltinConfig('eslint')
  ? ['--config', getConfig('eslintrc.js')]
  : [];

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
  // We need to take all the flag-less arguments (the files that should be linted)
  // and filter out the ones that aren't js files. Otherwise json or css files
  // may be passed through
  args = args.filter(
    a =>
      !parsedArgs._.includes(a) ||
      a.endsWith('.js') ||
      a.endsWith('.jsx') ||
      a.endsWith('.ts') ||
      a.endsWith('.tsx')
  );
}

start(whichConfig('eslint'));

// The eslintignore file is coincidentally ignored, so until this issue is resolved
// we need to make sure the user is not accidentally linting his node_modules
// https://github.com/eslint/eslint/issues/9227
let result;

if (useBuiltinIgnore) {
  warning('Please pass an eslintignore!');
  info(
    'Currently, eslint has issues with reading relative paths.',
    'Until it is resolved, please pass your eslintignore!',
    'See https://github.com/eslint/eslint/issues/9227'
  );
  result = { status: 1 };
} else {
  result = spawn.sync(
    resolveBin('eslint'),
    [...config, ...ignore, ...cache, ...args, ...filesToApply],
    { stdio: 'inherit' }
  );
}

process.exit(result.status);
