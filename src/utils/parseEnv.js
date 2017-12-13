const { envIsSet } = require('./envIsSet');

const parseEnv = (name, def) =>
  envIsSet(name) ? JSON.parse(process.env[name]) : def;

module.exports = { parseEnv };
