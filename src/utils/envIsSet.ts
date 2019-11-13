/* eslint no-process-env: "off" */

const envIsSet = (envVar: string): boolean =>
  Object.prototype.hasOwnProperty.call(process.env, envVar) &&
  typeof process.env[envVar] !== 'undefined' &&
  process.env[envVar] !== 'undefined';

export default envIsSet;
