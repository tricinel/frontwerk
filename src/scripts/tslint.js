const spawn = require('cross-spawn');
const yargsParser = require('yargs-parser');

const { getConfig } = require('../utils/getConfig');
const { resolveBin } = require('../utils/resolveBin');
const { start } = require('../utils/logger');
const { useBuiltinConfig, whichConfig } = require('../utils/whichConfig');
const { appDirectory } = require('../utils/appDirectory');

let args = process.argv.slice(2);

const parsedArgs = yargsParser(args);

const tsConfig = useBuiltinConfig('tslint')
  ? ['--config', getConfig('tslintconfig.js')]
  : [];

const filesGiven = parsedArgs._.length > 0;

const filesToApply = filesGiven ? [] : [`${appDirectory}/**/*.ts{,x}`];

if (!parsedArgs.p) {
  // Check if the -p flag is passed to tslint or fallback to default in frontwerk
  // -p flag is used to set the path or directory containing a tsconfig.json
  // file that will be used to determine which files will be linted
  args.push('-p', 'tsconfig.json');
}

if (filesGiven) {
  // we need to take all the flag-less arguments (the files that should be linted)
  // and filter out the ones that aren't ts files. Otherwise js, json or css files
  // may be passed through
  args = args.filter(
    a => !parsedArgs._.includes(a) || a.endsWith('.ts') || a.endsWith('.tsx')
  );
}

start(whichConfig('tslint'));

const result = spawn.sync(
  resolveBin('tslint'),
  [...tsConfig, ...args, ...filesToApply],
  { stdio: 'inherit' }
);

if (require.main === module) {
  process.exit(result.status);
}
