const spawn = require('cross-spawn');

const { resolveBin } = require('../utils/resolveBin');
const { fileExists } = require('../utils/fileExists');

const { ignore, include, libs } = require('../config/flowconfig');

const args = process.argv.slice(2);

const useBuiltinConfig = !fileExists('.flowconfig');

const color = !args.includes('--no-color') ? ['--color=always'] : [];

const config = useBuiltinConfig
  ? [
      `--ignore=${[...ignore]}`,
      `--include=${[...include]}`,
      `--lib=${[...libs]}`
    ]
  : [];

const result = spawn.sync(
  resolveBin('flow-bin', { executable: 'flow' }),
  ['check', ...color, ...config, ...args],
  { stdio: 'inherit' }
);

process.exit(result.status);
