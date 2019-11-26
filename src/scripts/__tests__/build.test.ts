/* eslint-disable global-require */
import cases from 'jest-in-case';
import jestSerializerPath from 'jest-serializer-path';

import {
  unquoteSerializer,
  winPathSerializer
} from '../../helpers/serializers';

expect.addSnapshotSerializer(unquoteSerializer);
expect.addSnapshotSerializer(winPathSerializer);
expect.addSnapshotSerializer(jestSerializerPath);

jest.mock('consola');

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
  const crossSpawn = require('cross-spawn');
  const syncSpy = jest
    .spyOn(crossSpawn, 'sync')
    .mockImplementation(() => ({ status: 0 }));
  const exitSpy = jest.spyOn(process, 'exit');
  const { argv: originalArgv } = process;

  try {
    // Tests
    process.argv = ['node', '../build', ...args];
    require('../build');

    expect(syncSpy).toHaveBeenCalledTimes(1);
    const [firstCall] = syncSpy.mock.calls;
    const [script, calledArgs] = firstCall as [string, string[]];
    expect([script, ...calledArgs].join(' ')).toMatchSnapshot();
  } finally {
    // We reset everything afterEach
    exitSpy.mockRestore();
    syncSpy.mockRestore();
    process.argv = originalArgv;
    jest.resetModules();
  }
};

cases('build', testFn, testCases);
