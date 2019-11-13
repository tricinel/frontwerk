import childProcess from 'child_process';

import { warning, info, start } from '../utils/logger';
import { useBuiltinConfig, whichConfig } from '../utils/whichConfig';
import jestConfig from '../config/jest.config';

process.env.BABEL_ENV = 'test'; // eslint-disable-line no-process-env
process.env.NODE_ENV = 'test'; // eslint-disable-line no-process-env

const isGitRepo = (): boolean => {
  try {
    const stdout = childProcess
      .execSync(`git rev-parse --is-inside-work-tree`, {
        stdio: ['pipe', 'pipe', 'ignore']
      })
      .toString();

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

if (watch.length > 0 && !isGitRepo()) {
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

const config = useBuiltinConfig('jest')
  ? ['--config', JSON.stringify(jestConfig)]
  : [];

start(whichConfig('jest'));

require('jest').run([...config, ...watch, ...args]); // eslint-disable-line jest/no-jest-import,@typescript-eslint/no-require-imports
