import spawn from 'cross-spawn';
import yargsParser from 'yargs-parser';

import getConfig from '../utils/getConfig';
import resolveBin from '../utils/resolveBin';
import fileExists from '../utils/fileExists';
import { useBuiltinConfig, whichConfig } from '../utils/whichConfig';
import { start } from '../utils/logger';

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

const filesToApply = parsedArgs._.length > 0 ? [] : ['**/*.+(css|sass|scss)'];

start(whichConfig('stylelint'));

const result = spawn.sync(
  resolveBin('stylelint'),
  [...filesToApply, ...config, ...ignore, ...cache, ...color, ...args],
  { stdio: 'inherit' }
);

process.exit(result.status);
