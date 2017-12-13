const envIsSet = name =>
  Object.prototype.hasOwnProperty.call(process.env, name) &&
  process.env[name] &&
  process.env[name] !== 'undefined';

module.exports = { envIsSet };
