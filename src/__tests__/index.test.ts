/* eslint-disable global-require */
import jestSerializerPath from 'jest-serializer-path';
import cases from 'jest-in-case';

import { unquoteSerializer, winPathSerializer } from '../helpers/serializers';

expect.addSnapshotSerializer(unquoteSerializer);
expect.addSnapshotSerializer(winPathSerializer);
expect.addSnapshotSerializer(jestSerializerPath);

jest.mock('cross-spawn');

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
  const originalExit = jest.spyOn(process, 'exit');
  const originalLog = jest.spyOn(console, 'log');
  const { argv: originalArgv } = process;

  delete process.version;
  process.version = nodeVersion;

  try {
    // Tests
    process.argv = ['node', '../', ...args];
    crossSpawnSyncMock.mockClear();
    require('../');

    if (snapshotLog) {
      expect(originalLog.mock.calls).toMatchSnapshot();
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
    // We reset everything afterEach
    originalExit.mockRestore();
    originalLog.mockRestore();
    process.argv = originalArgv;
    jest.resetModules();
  }
};

cases('format', testFn, testCases);
