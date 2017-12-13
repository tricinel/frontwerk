const chalk = require('chalk');

const { compose, join } = require('ramda');

const { log } = console;

const argsToArray = (...args) => [...args];

const formatMessage = compose(join('\n'), argsToArray);

const success = compose(log, chalk.green, formatMessage);
const error = compose(log, chalk.red, formatMessage);
const warning = compose(log, chalk.yellow, formatMessage);
const info = compose(log, chalk.blue, formatMessage);

module.exports = { formatMessage, success, error, warning, info };
