/* eslint-disable global-require */
import {
  unquoteSerializer,
  winPathSerializer
} from '../../helpers/serializers';

jest.mock('cross-spawn');
jest.mock('jest');

const cases = require('jest-in-case');
const jestSerializerPath = require('jest-serializer-path');

expect.addSnapshotSerializer(unquoteSerializer);
expect.addSnapshotSerializer(winPathSerializer);
expect.addSnapshotSerializer(jestSerializerPath);

const testCases = [
  {
    name: 'calls tslint CLI with default args',
    fnCalled: 1
  },
  {
    name: 'does not use built-in config with tslint.json file',
    fileExists: filename => filename === 'tslint.json'
  },
  {
    name: 'does not use built-in config with tslint.yaml file',
    fileExists: filename => filename === 'tslint.yaml'
  },
  {
    name: 'does not use built-in config with --config',
    args: ['--config', './custom-config.js']
  }
];

const testFn = ({
  fileExists = () => false,
  hasPkgProp = () => false,
  args = [],
  fnCalled = 1
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
    process.argv = ['node', '../tslint', ...args];
    crossSpawnSyncMock.mockClear();

    require('../tslint');

    expect(crossSpawnSyncMock).toHaveBeenCalledTimes(fnCalled);

    if (fnCalled > 0) {
      const [firstCall] = crossSpawnSyncMock.mock.calls;
      const [script, calledArgs] = firstCall;
      expect([script, ...calledArgs].join(' ')).toMatchSnapshot();
    }
  } catch (error) {
    throw error;
  } finally {
    // afterEach
    process.exit = originalExit;
    process.argv = originalArgv;
    jest.resetModules();
  }
};

cases('tslint', testFn, testCases);
