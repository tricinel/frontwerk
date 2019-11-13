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
  jest.mock('../../utils/hasDep', () => ({ hasDep: dep => dep === 'jest' }));
  const config = require('../eslintrc');
  expect(config.env.jest).toBe(true);
  expect(config.plugins).toContain('jest');
  expect(config.extends).toContain('plugin:jest/recommended');
  expect(config.plugins).not.toContain('react');

  expect(config).toMatchSnapshot();
});

test('Gets the eslint config when there is React as a project dependency', () => {
  jest.mock('../../utils/hasDep', () => ({ hasDep: dep => dep === 'react' }));
  const config = require('../eslintrc');
  expect(config.env.jquery).toBe(false);
  expect(config.plugins).toContain('react');
  expect(config.plugins).toContain('import');
  expect(config.plugins).toContain('jsx-a11y');

  expect(config).toMatchSnapshot();
});

test('Gets the eslint config when there are Jest and jQuery as project dependencies', () => {
  jest.mock('../../utils/hasDep', () => ({
    hasDep: dep => dep === 'jest' || dep === 'jquery'
  }));
  const config = require('../eslintrc');
  expect(config.env.jest).toBe(true);
  expect(config.env.jquery).toBe(true);
  expect(config.plugins).toContain('jest');

  expect(config).toMatchSnapshot();
});
