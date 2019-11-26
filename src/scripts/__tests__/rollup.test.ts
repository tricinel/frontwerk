/* eslint-disable global-require */

import cases from 'jest-in-case';
import jestSerializerPath from 'jest-serializer-path';

import {
  unquoteSerializer,
  winPathSerializer
} from '../../helpers/serializers';

jest.mock('concurrently');
jest.mock('rimraf');
jest.mock('consola');

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
  const crossSpawn = require('cross-spawn');
  const syncSpy = jest
    .spyOn(crossSpawn, 'sync')
    .mockImplementation(() => ({ status: 0 }));
  const exitSpy = jest.spyOn(process, 'exit');
  const { argv: originalArgv } = process;

  Object.assign(require('../../utils/fileExists'), { default: fileExists });
  Object.assign(require('../../utils/resolveBin'), {
    resolveBin: (modName: string, { executable = modName } = {}) => executable
  });

  try {
    // Tests
    process.argv = ['node', '../rollup', ...args];

    require('../rollup');

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

cases('rollup', testFn, testCases);
