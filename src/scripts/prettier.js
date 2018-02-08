const path = require('path');
const spawn = require('cross-spawn');

const { warning, info } = require('../utils/logger');

const [executor, script, ...args] = process.argv; // eslint-disable-line no-unused-vars
const scriptPath = require.resolve(path.join(__dirname, 'format'));

// Show deprecation warning
warning('This command will be deprecated in a future version of frontwerk!');
info(
  'Please use frontwerk format instead.',
  'You can pass the same options and it will work in the same way.'
);

const result = spawn.sync(executor, [scriptPath, ...args], {
  stdio: 'inherit'
});

process.exit(result.status);
