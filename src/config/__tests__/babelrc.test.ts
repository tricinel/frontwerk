/* eslint-disable global-require */
import jestSerializerPath from 'jest-serializer-path';

import {
  unquoteSerializer,
  winPathSerializer
} from '../../helpers/serializers';

expect.addSnapshotSerializer(unquoteSerializer);
expect.addSnapshotSerializer(winPathSerializer);
expect.addSnapshotSerializer(jestSerializerPath);

afterEach(() => {
  jest.resetModules();
});

test('Gets the babel config when there is React as a project dependency', () => {
  jest.mock('../../utils/hasDep', () => ({
    hasDep: (dep: string): boolean => dep === 'react'
  }));
  const apiMock = { cache: { forever: jest.fn() } };

  const { default: config } = require('../babelrc');
  const { presets } = config(apiMock);
  expect(presets).toContain(require.resolve('@babel/preset-react'));
});

test('Gets the babel config when there is TypeScript as a project dependency', () => {
  jest.mock('../../utils/hasDep', () => ({
    hasDep: (dep: string): boolean => dep === 'typescript'
  }));
  const apiMock = { cache: { forever: jest.fn() } };

  const { default: config } = require('../babelrc');
  const { presets } = config(apiMock);
  expect(presets).toContain(require.resolve('@babel/preset-typescript'));
});

test('Gets the babel config when we are building with rollup', () => {
  jest.mock('../../utils/parseEnv', () => (value: string): boolean =>
    value === 'BUILD_ROLLUP'
  );
  const apiMock = { cache: { forever: jest.fn() } };

  const { default: config } = require('../babelrc');
  const { plugins } = config(apiMock);
  expect(plugins).toContain(require.resolve('@babel/plugin-external-helpers'));
});
