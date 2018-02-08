process.env.BABEL_ENV = 'test';
process.env.NODE_ENV = 'test';

const { execSync } = require('child_process');

const { hasPkgProp } = require('../utils/pkg');
const { fileExists } = require('../utils/fileExists');
const { warning, info } = require('../utils/logger');
const jestConfig = require('../config/jest.config');

const isGitRepo = () => {
  try {
    const stdout = execSync(`git rev-parse --is-inside-work-tree`, {
      stdio: ['pipe', 'pipe', 'ignore']
    }).toString();

    return Boolean(stdout);
  } catch (e) {
    return false;
  }
};

const args = process.argv.slice(2);

let watch =
  !args.includes('--no-watch') &&
  !args.includes('--coverage') &&
  !args.includes('--updateSnapshot')
    ? ['--watch']
    : [];

if (watch.length && !isGitRepo()) {
  watch = [];
  warning('You are not in a git repository!');
  info(
    'By default, jest will run -o when using watch mode.',
    'This will only work if you are running tests in a git repository.',
    'See https://facebook.github.io/jest/docs/en/cli.html#onlychanged',
    '',
    'Running your tests without --watch'
  );
}

const config =
  !args.includes('--config') &&
  !hasPkgProp('jest') &&
  !fileExists('jest.config.js')
    ? ['--config', JSON.stringify(jestConfig)]
    : [];

require('jest').run([...config, ...watch, ...args]);
