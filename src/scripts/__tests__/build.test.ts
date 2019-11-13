/* eslint-disable global-require */

import cases from 'jest-in-case';
import jestSerializerPath from 'jest-serializer-path';

import {
  unquoteSerializer,
  winPathSerializer
} from '../../helpers/serializers';

jest.mock('cross-spawn');

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
  const originalExit = jest.spyOn(process, 'exit');
  const { argv: originalArgv } = process;

  try {
    // Tests
    process.argv = ['node', '../build', ...args];
    crossSpawnSyncMock.mockClear();
    require('../build');

    expect(crossSpawnSyncMock).toHaveBeenCalledTimes(1);
    const [firstCall] = crossSpawnSyncMock.mock.calls;
    const [script, calledArgs] = firstCall;
    expect([script, ...calledArgs].join(' ')).toMatchSnapshot();
  } finally {
    // We reset everything afterEach
    originalExit.mockRestore();
    process.argv = originalArgv;
    jest.resetModules();
  }
};

cases('build', testFn, testCases);
