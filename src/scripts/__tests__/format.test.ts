/* eslint-disable global-require */
import jestSerializerPath from 'jest-serializer-path';
import cases from 'jest-in-case';

import {
  unquoteSerializer,
  winPathSerializer
} from '../../helpers/serializers';

jest.mock('consola');

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
  const crossSpawn = require('cross-spawn');
  const syncSpy = jest
    .spyOn(crossSpawn, 'sync')
    .mockImplementation(() => ({ status: 0 }));
  const exitSpy = jest.spyOn(process, 'exit');
  const { argv: originalArgv } = process;

  Object.assign(require('../../utils/fileExists'), { default: fileExists });
  Object.assign(require('../../utils/pkg'), { hasPkgProp });
  Object.assign(require('../../utils/resolveBin'), {
    resolveBin: (modName: string, { executable = modName } = {}) => executable
  });

  try {
    // Tests
    process.argv = ['node', '../format', ...args];
    require('../format');

    expect(syncSpy).toHaveBeenCalledTimes(1);
    const [firstCall] = syncSpy.mock.calls;
    const [script, calledArgs] = firstCall as ['prettier', string[]];
    expect([script, ...calledArgs].join(' ')).toMatchSnapshot();
  } finally {
    // We reset everything afterEach
    exitSpy.mockRestore();
    syncSpy.mockRestore();
    process.argv = originalArgv;
    jest.resetModules();
  }
};

cases('format', testFn, testCases);
