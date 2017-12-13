const path = require('path');
const spawn = require('cross-spawn');
const { compose, join, map } = require('ramda');

const docs = require('./docs');

const [executor, ignoredBin, script, ...args] = process.argv;

const attemptResolve = (...resolveArgs) => {
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
      `Unknown script ${script}. Please check if you need to update ff-scripts.`
    );
  }

  const result = spawn.sync(executor, [scriptPath, ...args], {
    stdio: 'inherit'
  });

  process.exit(result.status);
};

const showErrorMessage = () => {
  const describe = o => `${o.name}: ${o.desc}`;
  const getScriptsAndOpts = compose(join('\n'), map(describe));

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
