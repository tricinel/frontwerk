import spawn from 'cross-spawn';
import yargsParser from 'yargs-parser';

import getConfig from '../utils/getConfig';
import resolveBin from '../utils/resolveBin';
import fileExists from '../utils/fileExists';
import { useBuiltinConfig, whichConfig } from '../utils/whichConfig';
import { start } from '../utils/logger';

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

const filesToApply =
  parsedArgs._.length > 0 ? parsedArgs._ : ['**/*.+(js|jsx|json|css|ts|md)'];

start(whichConfig('prettier'));

const result = spawn.sync(
  resolveBin('prettier'),
  [...config, ...ignore, ...write, ...filesToApply],
  { stdio: 'inherit' }
);

process.exit(result.status);
