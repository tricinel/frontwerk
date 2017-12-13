/* eslint-disable global-require */
jest.mock('jest', () => ({ run: jest.fn() }));
jest.mock('../../config/jest.config', () => ({ builtInConfig: true }));

const cases = require('jest-in-case');

const testCases = [
  {
    name: 'calls jest CLI with default args'
  },
  {
    name: 'does not watch with --no-watch',
    args: ['--no-watch']
  },
  {
    name: 'does not watch with --coverage',
    args: ['--no-coverage']
  },
  {
    name: 'does not watch --updateSnapshot',
    args: ['--updateSnapshot']
  },
  {
    name: 'does not use built-in config with jest pkg prop',
    hasPkgProp: prop => prop === 'jest'
  },
  {
    name: 'does not use built-in config with --config',
    args: ['--config', './custom-config.js']
  },
  {
    name: 'forwards args',
    args: ['--coverage', '--watch']
  }
];

const testFn = ({ hasPkgProp = () => false, args = [] }) => {
  const { run: jestRunMock } = require('jest');
  const originalExit = process.exit;
  const originalArgv = process.argv;
  process.exit = jest.fn();

  Object.assign(require('../../utils/pkg'), { hasPkgProp });

  process.exit = jest.fn();

  try {
    // tests
    process.argv = ['node', '../test', ...args];
    jestRunMock.mockClear();

    require('../test');

    expect(jestRunMock).toHaveBeenCalledTimes(1);
    const [firstCall] = jestRunMock.mock.calls;
    const [jestArgs] = firstCall;
    expect(jestArgs.join(' ')).toMatchSnapshot();
  } catch (error) {
    throw error;
  } finally {
    // afterEach
    process.exit = originalExit;
    process.argv = originalArgv;
    jest.resetModules();
  }
};

cases('format', testFn, testCases);
