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
  const config = require('../babelrc');
  expect(config.presets).toContain(require.resolve('babel-preset-react'));
});

test('Gets the babel config when we are building with rollup', () => {
  jest.mock('../../utils/parseEnv', () => ({
    parseEnv: (value: string): boolean => value === 'BUILD_ROLLUP'
  }));
  const config = require('../babelrc');
  expect(config.plugins).toContain(
    require.resolve('babel-plugin-external-helpers')
  );
});
