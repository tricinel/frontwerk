/* eslint-disable global-require */
import {
  unquoteSerializer,
  winPathSerializer
} from '../../helpers/serializers';

jest.mock('cross-spawn');
jest.mock('concurrently');
jest.mock('jest');

const cases = require('jest-in-case');
const jestSerializerPath = require('jest-serializer-path');

expect.addSnapshotSerializer(unquoteSerializer);
expect.addSnapshotSerializer(winPathSerializer);
expect.addSnapshotSerializer(jestSerializerPath);

const testCases = [
  {
    name: 'calls webpack CLI with default args'
  },
  {
    name: '--no-clean will not clean the dist directory',
    args: ['--no-clean']
  },
  {
    name: '--env will pass the environment',
    args: ['--env', 'production']
  },
  {
    name: '--mode will pass the development mode',
    args: ['--mode', 'development']
  },
  {
    name: '--mode will pass the production mode',
    args: ['--mode', 'production']
  },
  {
    name: '--entry will pass the entry folder',
    args: ['--entry', 'src']
  },
  {
    name: '--output-path will pass the output path folder',
    args: ['--output-path', './.tmp/build']
  },
  {
    name: 'does not use built-in config with webpack.config.js file',
    fileExists: filename => filename === 'webpack.config.js'
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
    process.argv = ['node', '../webpack', ...args];
    crossSpawnSyncMock.mockClear();

    require('../webpack');

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

cases('webpack', testFn, testCases);
