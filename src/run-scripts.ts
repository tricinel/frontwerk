import path from 'path';
import spawn from 'cross-spawn';
import { compose, join, map } from 'ramda';

import { error, info } from './utils/logger';
import docs, { Script } from './docs';
import safeExit from './utils/proc';

const [executor, ignoredBin, script, ...args] = process.argv;

const attemptResolve = (...resolveArgs: [string]) => {
  try {
    return require.resolve(...resolveArgs);
  } catch (error) {
    return null;
  }
};

const handleSignal = (signal: string): void => {
  if (signal === 'SIGKILL') {
    error(
      `The script "${script}" failed because the process exited too early.`,
      'This probably means the system ran out of memory or someone called `kill -9` on the process.'
    );
  } else if (signal === 'SIGTERM') {
    error(
      `The script "${script}" failed because the process exited too early.`,
      'Someone might have called `kill` or `killall`, or the system could be shutting down.'
    );
  }
  safeExit(1);
};

const runScript = () => {
  const relativeScriptPath = path.join(__dirname, './scripts', script);
  const scriptPath = attemptResolve(relativeScriptPath);

  if (!scriptPath) {
    throw new Error(
      `Unknown script ${script}. Please check if you need to update frontwerk.`
    );
  }

  const result = spawn.sync(executor, [scriptPath, ...args], {
    stdio: 'inherit'
  });

  if (result.signal) {
    handleSignal(result.signal);
  }

  safeExit(result.status);
};

const showHelpMessage = () => {
  const describe = (o: Script) => `${o.name}: ${o.desc}`;
  const getScriptsAndOpts: (scripts: Script[]) => string = compose(
    join('\n'),
    map(describe)
  );

  const fullMessage = `
Usage: ${ignoredBin} [script] [--flags]
Available Scripts:
${getScriptsAndOpts(docs.availableScripts)}
Options:
  All options depend on the script. The args you pass will be forwarded to the respective tool that's being run under the hood.
  `.trim();

  info(`\n${fullMessage}\n`);
};

if (script) {
  runScript();
} else {
  showHelpMessage();
}
