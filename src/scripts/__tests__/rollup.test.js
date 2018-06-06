/* eslint-disable global-require */
import {
  unquoteSerializer,
  winPathSerializer
} from '../../helpers/serializers';

jest.mock('cross-spawn');
jest.mock('concurrently');
jest.mock('jest');
jest.mock('rimraf');

const cases = require('jest-in-case');
const jestSerializerPath = require('jest-serializer-path');

expect.addSnapshotSerializer(unquoteSerializer);
expect.addSnapshotSerializer(winPathSerializer);
expect.addSnapshotSerializer(jestSerializerPath);

const testCases = [
  {
    name: 'calls rollup CLI with default args'
  },
  {
    name: '--no-clean will not clean the dist directory',
    args: ['--no-clean']
  },
  {
    name: 'watches with --watch',
    args: ['--watch']
  },
  {
    name: '--environment will pass the environment',
    args: ['--environment', 'production']
  },
  {
    name: 'does not use built-in config with rollup.config.js file',
    fileExists: filename => filename === 'rollup.config.js'
  },
  {
    name: 'does not use built-in config with --config',
    args: ['--config', './custom-config.js']
  }
];

const testFn = ({ fileExists = () => false, args = [] }) => {
  const { sync: crossSpawnSyncMock } = require('cross-spawn');
  const originalExit = process.exit;
  const originalArgv = process.argv;
  process.exit = jest.fn();

  Object.assign(require('../../utils/fileExists'), { fileExists });
  Object.assign(require('../../utils/resolveBin'), {
    resolveBin: (modName, { executable = modName } = {}) => executable
  });

  process.exit = jest.fn();

  try {
    // tests
    process.argv = ['node', '../rollup', ...args];
    crossSpawnSyncMock.mockClear();

    require('../rollup');

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

cases('rollup', testFn, testCases);
