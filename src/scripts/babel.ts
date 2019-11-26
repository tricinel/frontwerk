import path from 'path';
import spawn from 'cross-spawn';
import rimraf from 'rimraf';
import yargsParser from 'yargs-parser';

import fromRoot from '../utils/fromRoot';
import resolveBin from '../utils/resolveBin';
import { useBuiltinConfig, whichConfig } from '../utils/whichConfig';
import { start } from '../utils/logger';
import safeExit from '../utils/proc';

const args = process.argv.slice(2);
const parsedArgs = yargsParser(args);

const config = useBuiltinConfig('babel')
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

start(whichConfig('babel'));

const result = spawn.sync(
  resolveBin('@babel/cli', { executable: 'babel' }),
  [...outDir, ...copyFiles, ...ignore, ...config, ...filesToApply].concat(args),
  { stdio: 'inherit' }
);

safeExit(result.status);
