/* eslint-disable global-require */
jest.mock('cross-spawn');
jest.mock('jest');

const cases = require('jest-in-case');

const testCases = [
  {
    name: 'calls prettier CLI with default args'
  },
  {
    name: '--no-write prevents --write argument from being added',
    args: ['--no-write']
  },
  {
    name: 'calls prettier CLI with args',
    args: ['my-src/**/*.js']
  },
  {
    name: 'does not use built-in config with .prettierrc file',
    fileExists: filename => filename === '.prettierrc'
  },
  {
    name: 'does not use built-in config with prettier.config.js file',
    fileExists: filename => filename === 'prettier.config.js'
  },
  {
    name: 'does not use built-in config with prettierrc pkg prop',
    hasPkgProp: prop => prop === 'prettierrc'
  },
  {
    name: 'does not use built-in ignore with --ignore-path',
    args: ['--ignore-path', './my-ignore']
  },
  {
    name: 'does not use built-in config with --config',
    args: ['--config', './custom-config.js']
  }
];

const testFn = ({
  fileExists = () => false,
  hasPkgProp = () => false,
  args = []
}) => {
  const { sync: crossSpawnSyncMock } = require('cross-spawn');
  const originalExit = process.exit;
  const originalArgv = process.argv;
  process.exit = jest.fn();

  Object.assign(require('../../utils/fileExists'), { fileExists });
  Object.assign(require('../../utils/pkg'), { hasPkgProp });
  Object.assign(require('../../utils/resolveBin'), {
    resolveBin: (modName, { executable = modName } = {}) => executable
  });

  process.exit = jest.fn();

  try {
    // tests
    process.argv = ['node', '../prettier', ...args];
    crossSpawnSyncMock.mockClear();

    require('../prettier');

    expect(crossSpawnSyncMock).toHaveBeenCalledTimes(1);
    const [firstCall] = crossSpawnSyncMock.mock.calls;
    const [script, calledArgs] = firstCall;
    expect([script, ...calledArgs].join(' ')).toMatchSnapshot();
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
