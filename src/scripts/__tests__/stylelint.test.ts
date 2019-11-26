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
    name: 'calls prettier CLI with default args'
  },
  {
    name: '--no-cache will disable caching',
    args: ['--no-cache']
  },
  {
    name: '--no-color will disable colored output',
    args: ['--no-color']
  },
  {
    name: 'calls prettier CLI with args',
    args: ['my-src/**/*.css']
  },
  {
    name: 'does not use built-in config with .stylelintrc file',
    fileExists: (filename: string): boolean => filename === '.stylelintrc'
  },
  {
    name: 'does not use built-in config with stylelint.config.js file',
    fileExists: (filename: string): boolean =>
      filename === 'stylelint.config.js'
  },
  {
    name: 'does not use built-in config with stylelint pkg prop',
    hasPkgProp: (prop: string): boolean => prop === 'stylelint'
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
    process.argv = ['node', '../stylelint', ...args];

    require('../stylelint');

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

cases('stylelint', testFn, testCases);
