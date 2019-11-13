import path from 'path';
import spawn from 'cross-spawn';
import { compose, join, map } from 'ramda';

import docs, { Script } from './docs';

const [executor, ignoredBin, script, ...args] = process.argv;

const attemptResolve = (...resolveArgs: [string]) => {
  try {
    return require.resolve(...resolveArgs);
  } catch (error) {
    return null;
  }
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

  process.exit(result.status);
};

const showErrorMessage = () => {
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

  console.log(`\n${fullMessage}\n`);
};

if (script) {
  runScript();
} else {
  showErrorMessage();
}
