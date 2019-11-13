/* eslint-disable global-require */

import cases from 'jest-in-case';
import jestSerializerPath from 'jest-serializer-path';

import {
  unquoteSerializer,
  winPathSerializer
} from '../../helpers/serializers';

jest.mock('jest', () => ({ run: jest.fn() }));
jest.mock('../../config/jest.config', () => ({ builtInConfig: true }));

expect.addSnapshotSerializer(unquoteSerializer);
expect.addSnapshotSerializer(winPathSerializer);
expect.addSnapshotSerializer(jestSerializerPath);

const testCases = [
  {
    name: 'calls jest CLI with default args'
  },
  {
    name: 'does not watch with --no-watch',
    args: ['--no-watch']
  },
  {
    name: 'does not watch with --coverage',
    args: ['--no-coverage']
  },
  {
    name: 'does not watch --updateSnapshot',
    args: ['--updateSnapshot']
  },
  {
    name: 'does not use built-in config with jest pkg prop',
    hasPkgProp: (prop: string): boolean => prop === 'jest'
  },
  {
    name: 'does not use built-in config with --config',
    args: ['--config', './custom-config.js']
  },
  {
    name: 'forwards args',
    args: ['--coverage', '--watch']
  }
];

const testFn = ({ hasPkgProp = () => false, args = [] }) => {
  const { run: jestRunMock } = require('jest'); // eslint-disable-line jest/no-jest-import
  const originalExit = jest.spyOn(process, 'exit');
  const { argv: originalArgv } = process;

  Object.assign(require('../../utils/pkg'), { hasPkgProp });

  try {
    // Tests
    process.argv = ['node', '../test', ...args];
    jestRunMock.mockClear();

    require('../test');

    expect(jestRunMock).toHaveBeenCalledTimes(1);
    const [firstCall] = jestRunMock.mock.calls;
    const [jestArgs] = firstCall;
    expect(jestArgs.join(' ')).toMatchSnapshot();
  } finally {
    // We reset everything afterEach
    originalExit.mockRestore();
    process.argv = originalArgv;
    jest.resetModules();
  }
};

cases('test', testFn, testCases);
