/* eslint-disable global-require */
import { unquoteSerializer, winPathSerializer } from '../helpers/serializers';

const jestSerializerPath = require('jest-serializer-path');

expect.addSnapshotSerializer(unquoteSerializer);
expect.addSnapshotSerializer(winPathSerializer);
expect.addSnapshotSerializer(jestSerializerPath);

jest.mock('cross-spawn');

const cases = require('jest-in-case');

const testCases = [
  {
    name: 'errors out when using the wrong node version',
    nodeVersion: 'v6.11.0',
    throws: true
  },
  {
    name: 'calls node with the script path and args',
    args: ['test', '--no-watch']
  },
  {
    name: 'throws unknown script',
    args: ['unknown-script'],
    throws: true
  },
  {
    name: 'logs help with no args',
    snapshotLog: true
  }
];

const testFn = ({
  snapshotLog = false,
  throws = false,
  args = [],
  nodeVersion = 'v8.4.0'
}) => {
  const { sync: crossSpawnSyncMock } = require('cross-spawn');
  const originalExit = process.exit;
  const originalArgv = process.argv;
  const originalLog = console.log;
  process.exit = jest.fn();
  console.log = jest.fn();

  delete process.version;
  process.version = nodeVersion;

  try {
    // tests
    process.argv = ['node', '../', ...args];
    crossSpawnSyncMock.mockClear();
    require('../');

    if (snapshotLog) {
      expect(console.log.mock.calls).toMatchSnapshot();
    } else {
      expect(crossSpawnSyncMock).toHaveBeenCalledTimes(1);
      const [firstCall] = crossSpawnSyncMock.mock.calls;
      const [script, calledArgs] = firstCall;
      expect([script, ...calledArgs].join(' ')).toMatchSnapshot();
    }
  } catch (error) {
    if (throws) {
      expect(error.message).toMatchSnapshot();
    } else {
      throw error;
    }
  } finally {
    // afterEach
    process.exit = originalExit;
    process.argv = originalArgv;
    console.log = originalLog;
    jest.resetModules();
  }
};

cases('format', testFn, testCases);
