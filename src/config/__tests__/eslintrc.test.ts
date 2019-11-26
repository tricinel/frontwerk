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

test('Gets the eslint config when there is Jest as a project dependency', () => {
  jest.mock('../../utils/hasDep', () => ({
    hasDep: (dep: string): boolean => dep === 'jest'
  }));
  const config = require('../eslintrc');
  expect(config.env.jest).toBe(true);
  expect(config.plugins).toContain('jest');
  expect(config.extends).toContain('plugin:jest/recommended');
  expect(config.extends).toEqual(
    expect.arrayContaining([expect.stringContaining('eslint-config-frontwerk')])
  );

  expect(config).toMatchSnapshot();
});

test('Gets the eslint config when there is React as a project dependency', () => {
  jest.mock('../../utils/hasDep', () => ({
    hasDep: (dep: string): boolean => dep === 'react'
  }));
  const config = require('../eslintrc');
  expect(config.env.jquery).toBe(false);
  expect(config.extends).toEqual(
    expect.arrayContaining([
      expect.stringContaining('eslint-config-frontwerk-react')
    ])
  );

  expect(config).toMatchSnapshot();
});

test('Gets the eslint config when there is TypeScript as a project dependency', () => {
  jest.mock('../../utils/hasDep', () => ({
    hasDep: (dep: string): boolean => dep === 'typescript'
  }));
  const config = require('../eslintrc');
  expect(config.env.jquery).toBe(false);
  expect(config.extends).toEqual(
    expect.arrayContaining([
      expect.stringContaining('eslint-config-frontwerk-typescript'),
      expect.stringContaining('prettier/@typescript-eslint')
    ])
  );

  expect(config).toMatchSnapshot();
});

test('Gets the eslint config when there are Jest and jQuery as project dependencies', () => {
  jest.mock('../../utils/hasDep', () => ({
    hasDep: (dep: string): boolean => dep === 'jest' || dep === 'jquery'
  }));
  const config = require('../eslintrc');
  expect(config.env.jest).toBe(true);
  expect(config.env.jquery).toBe(true);
  expect(config.plugins).toContain('jest');

  expect(config).toMatchSnapshot();
});
