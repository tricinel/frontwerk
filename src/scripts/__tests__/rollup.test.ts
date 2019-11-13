/* eslint-disable global-require */

import cases from 'jest-in-case';
import jestSerializerPath from 'jest-serializer-path';

import {
  unquoteSerializer,
  winPathSerializer
} from '../../helpers/serializers';

jest.mock('cross-spawn');
jest.mock('concurrently');
jest.mock('jest');
jest.mock('rimraf');

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
    fileExists: (filename: string): boolean => filename === 'rollup.config.js'
  },
  {
    name: 'does not use built-in config with --config',
    args: ['--config', './custom-config.js']
  }
];

const testFn = ({ fileExists = () => false, args = [] }) => {
  const { sync: crossSpawnSyncMock } = require('cross-spawn');
  const originalExit = jest.spyOn(process, 'exit');
  const { argv: originalArgv } = process;

  Object.assign(require('../../utils/fileExists'), { fileExists });
  Object.assign(require('../../utils/resolveBin'), {
    resolveBin: (modName: string, { executable = modName } = {}) => executable
  });

  try {
    // Tests
    process.argv = ['node', '../rollup', ...args];
    crossSpawnSyncMock.mockClear();

    require('../rollup');

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

cases('rollup', testFn, testCases);
