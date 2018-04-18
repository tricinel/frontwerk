/* eslint-disable global-require */
import {
  unquoteSerializer,
  winPathSerializer
} from '../../helpers/serializers';

jest.mock('cross-spawn');

const cases = require('jest-in-case');
const jestSerializerPath = require('jest-serializer-path');

expect.addSnapshotSerializer(unquoteSerializer);
expect.addSnapshotSerializer(winPathSerializer);
expect.addSnapshotSerializer(jestSerializerPath);

const testCases = [
  {
    name: 'calls node with default args'
  },
  {
    name: 'calls node with --bundle',
    args: ['--bundle']
  },
  {
    name: 'calls node with --pack',
    args: ['--pack']
  }
];

const testFn = ({ args = [] }) => {
  const { sync: crossSpawnSyncMock } = require('cross-spawn');
  const originalExit = process.exit;
  const originalArgv = process.argv;
  process.exit = jest.fn();

  try {
    // tests
    process.argv = ['node', '../build', ...args];
    crossSpawnSyncMock.mockClear();
    require('../build');

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

cases('build', testFn, testCases);
