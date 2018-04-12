const consola = require('consola');

const { compose, join } = require('ramda');

const argsToArray = (...args) => [...args];

const formatMessage = compose(join('\n'), argsToArray);

const success = compose(consola.success, formatMessage);
const error = compose(consola.error, formatMessage);
const warning = compose(consola.warn, formatMessage);
const info = compose(consola.info, formatMessage);
const start = compose(consola.start, formatMessage);

module.exports = { formatMessage, success, error, warning, info, start };
