/* eslint-disable global-require */
import jestSerializerPath from 'jest-serializer-path';
import cases from 'jest-in-case';

import { unquoteSerializer, winPathSerializer } from '../helpers/serializers';

expect.addSnapshotSerializer(unquoteSerializer);
expect.addSnapshotSerializer(winPathSerializer);
expect.addSnapshotSerializer(jestSerializerPath);

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
  },
  {
    name: 'handles SIGKILL',
    args: ['test'],
    signal: 'SIGKILL'
  },
  {
    name: 'handles SIGTERM',
    args: ['test'],
    signal: 'SIGTERM'
  }
];

const testFn = ({
  snapshotLog = false,
  throws = false,
  args = [],
  nodeVersion = 'v10',
  signal = null
}) => {
  const crossSpawn = require('cross-spawn');
  const syncSpy = jest
    .spyOn(crossSpawn, 'sync')
    .mockImplementation(() => ({ signal, status: 0 }));
  const consola = require('consola');
  const exitSpy = jest.spyOn(process, 'exit');
  const logSpy = jest.spyOn(consola, 'info').mockImplementation(() => {});
  const errorSpy = jest.spyOn(consola, 'error').mockImplementation(() => {});
  const { argv: originalArgv } = process;

  delete process.version;
  process.version = nodeVersion;

  try {
    // Tests
    process.argv = ['node', '../', ...args];
    require('../');

    if (typeof signal === 'string') {
      expect(errorSpy).toHaveBeenCalledTimes(1);
      expect(errorSpy.mock.calls).toMatchSnapshot();
    } else if (snapshotLog) {
      expect(logSpy).toHaveBeenCalledTimes(1);
      expect(logSpy.mock.calls).toMatchSnapshot();
    } else {
      expect(syncSpy).toHaveBeenCalledTimes(1);
      const [firstCall] = syncSpy.mock.calls;
      const [script, calledArgs] = firstCall as [string, string[]];
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
    exitSpy.mockRestore();
    logSpy.mockRestore();
    errorSpy.mockRestore();
    syncSpy.mockRestore();
    process.argv = originalArgv;
    jest.resetModules();
  }
};

cases('index', testFn, testCases);
