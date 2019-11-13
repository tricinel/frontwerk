/* eslint no-process-env: "off" */

import envIsSet from './envIsSet';

const parseEnv = <T>(envVar: string, def?: T): T =>
  envIsSet(envVar) ? JSON.parse(JSON.stringify(process.env[envVar])) : def;

export default parseEnv;
