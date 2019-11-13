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
    name: 'calls eslint CLI with default args',
    fnCalled: 0
  },
  {
    name: '--no-cache will disable caching',
    args: ['--no-cache', '--ignore-path', './my-ignore']
  },
  {
    name: 'does not use built-in config with .eslintrc file',
    args: ['--ignore-path', './my-ignore'],
    fileExists: (filename: string): boolean => filename === '.eslintrc'
  },
  {
    name: 'does not use built-in config with eslintrc.js file',
    args: ['--ignore-path', './my-ignore'],
    fileExists: (filename: string): boolean => filename === 'eslintrc.js'
  },
  {
    name: 'does not use built-in config with eslintConfig pkg prop',
    args: ['--ignore-path', './my-ignore'],
    hasPkgProp: (prop: string): boolean => prop === 'eslintConfig'
  },
  {
    name: 'does not use built-in ignore with --ignore-path',
    args: ['--ignore-path', './my-ignore'],
    fnCalled: 1
  },
  {
    name: 'does not use built-in config with --config',
    args: ['--config', './custom-config.js', '--ignore-path', './my-ignore']
  },
  {
    name: 'does not use built-in ignore with .eslintignore file',
    fileExists: (filename: string): boolean => filename === '.eslintignore',
    fnCalled: 1
  }
];

const testFn = ({
  fileExists = () => false,
  hasPkgProp = () => false,
  args = [],
  fnCalled = 1
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
    process.argv = ['node', '../lint', ...args];
    crossSpawnSyncMock.mockClear();

    require('../lint');

    expect(crossSpawnSyncMock).toHaveBeenCalledTimes(fnCalled);

    if (fnCalled > 0) {
      const [firstCall] = crossSpawnSyncMock.mock.calls;
      const [script, calledArgs] = firstCall;
      expect([script, ...calledArgs].join(' ')).toMatchSnapshot();
    }
  } finally {
    // We reset everything afterEach
    originalExit.mockRestore();
    process.argv = originalArgv;
    jest.resetModules();
  }
};

cases('lint', testFn, testCases);
