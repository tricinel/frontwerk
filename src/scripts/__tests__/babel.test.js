/* eslint-disable global-require */
jest.mock('cross-spawn');
jest.mock('jest');

const cases = require('jest-in-case');

const testCases = [
  {
    name: 'calls babel CLI with default args'
  },
  {
    name: '--no-copy-files will not copy the files',
    args: ['--no-copy-files']
  },
  {
    name: '--out-dir will use the specified out dir',
    args: ['--out-dir', './.tmp/build']
  },
  {
    name: '--no-clean will not clean the outDir',
    args: ['--no-clean']
  },
  {
    name: '--no-color will disable colored output',
    args: ['--no-color']
  },
  {
    name: 'does not use built-in config with .babelrc file',
    fileExists: filename => filename === '.babelrc'
  },
  {
    name: 'does not use built-in config with babel pkg prop',
    hasPkgProp: prop => prop === 'babel'
  },
  {
    name: 'does not use built-in ignore with --ignore',
    args: ['--ignore', '__custom__']
  },
  {
    name: 'does not use built-in config with --presets',
    args: ['--presets', './custom-presets.js']
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

  try {
    // tests
    process.argv = ['node', '../babel', ...args];
    crossSpawnSyncMock.mockClear();

    require('../babel');

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

cases('babel', testFn, testCases);
