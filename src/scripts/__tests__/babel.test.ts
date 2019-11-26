/* eslint-disable global-require */
import cases from 'jest-in-case';
import jestSerializerPath from 'jest-serializer-path';

import {
  unquoteSerializer,
  winPathSerializer
} from '../../helpers/serializers';

jest.mock('rimraf');
jest.mock('consola');

expect.addSnapshotSerializer(unquoteSerializer);
expect.addSnapshotSerializer(winPathSerializer);
expect.addSnapshotSerializer(jestSerializerPath);

const testCases = [
  {
    name: 'calls babel CLI with default args'
  },
  {
    name: '--no-copy-files will not copy the files',
    args: ['--no-copy-files']
  },
  {
    name: '--out-dir will use the specified out dir',
    args: ['--out-dir', './.tmp/build']
  },
  {
    name: '--no-clean will not clean the outDir',
    args: ['--no-clean']
  },
  {
    name: '--no-color will disable colored output',
    args: ['--no-color']
  },
  {
    name: 'does not use built-in config with .babelrc file',
    fileExists: (filename: string): boolean => filename === '.babelrc'
  },
  {
    name: 'does not use built-in config with babel pkg prop',
    hasPkgProp: (prop: string): boolean => prop === 'babel'
  },
  {
    name: 'does not use built-in ignore with --ignore',
    args: ['--ignore', '__custom__']
  },
  {
    name: 'does not use built-in config with --presets',
    args: ['--presets', './custom-presets.js']
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
    process.argv = ['node', '../babel', ...args];

    require('../babel');

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

cases('babel', testFn, testCases);
