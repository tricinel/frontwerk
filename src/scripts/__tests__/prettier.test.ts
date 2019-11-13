/* eslint-disable global-require */

import cases from 'jest-in-case';
import jestSerializerPath from 'jest-serializer-path';

import {
  unquoteSerializer,
  winPathSerializer
} from '../../helpers/serializers';

jest.mock('cross-spawn');
jest.mock('jest');

expect.addSnapshotSerializer(unquoteSerializer);
expect.addSnapshotSerializer(winPathSerializer);
expect.addSnapshotSerializer(jestSerializerPath);

const testCases = [
  {
    name: 'calls prettier CLI with default args'
  },
  {
    name: '--no-write prevents --write argument from being added',
    args: ['--no-write']
  },
  {
    name: 'calls prettier CLI with args',
    args: ['my-src/**/*.js']
  },
  {
    name: 'does not use built-in config with .prettierrc file',
    fileExists: (filename: string): boolean => filename === '.prettierrc'
  },
  {
    name: 'does not use built-in config with prettier.config.js file',
    fileExists: (filename: string): boolean => filename === 'prettier.config.js'
  },
  {
    name: 'does not use built-in config with prettierrc pkg prop',
    hasPkgProp: (prop: string): boolean => prop === 'prettierrc'
  },
  {
    name: 'does not use built-in ignore with --ignore-path',
    args: ['--ignore-path', './my-ignore']
  },
  {
    name: 'does not use built-in config with --config',
    args: ['--config', './custom-config.js']
  }
];

const testFn = ({
  fileExists = () => false,
  hasPkgProp = () => false,
  args = []
}) => {
  const { sync: crossSpawnSyncMock } = require('cross-spawn');
  const originalExit = jest.spyOn(process, 'exit');
  const { argv: originalArgv } = process;

  Object.assign(require('../../utils/fileExists'), { fileExists });
  Object.assign(require('../../utils/pkg'), { hasPkgProp });
  Object.assign(require('../../utils/resolveBin'), {
    resolveBin: (modName: string, { executable = modName } = {}) => executable
  });

  try {
    // Tests
    process.argv = ['node', '../format', ...args];
    crossSpawnSyncMock.mockClear();

    require('../format');

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

cases('format', testFn, testCases);
