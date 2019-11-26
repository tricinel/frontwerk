/* eslint-disable global-require */
import jestSerializerPath from 'jest-serializer-path';

import {
  unquoteSerializer,
  winPathSerializer
} from '../../helpers/serializers';

expect.addSnapshotSerializer(unquoteSerializer);
expect.addSnapshotSerializer(winPathSerializer);
expect.addSnapshotSerializer(jestSerializerPath);

jest.mock('../../utils/fromRoot', () => () => '');

afterEach(() => {
  jest.resetModules();
});

describe('Gets the correct test environment for jest', () => {
  test('with jsdom', () => {
    jest.mock('../../utils/hasDep', () => ({
      hasDep: (dep: string): boolean => dep === 'rollup' || dep === 'react'
    }));
    const config = require('../jest.config');
    expect(config.testEnvironment).toEqual('jsdom');
  });

  test('with node', () => {
    jest.mock('../../utils/hasDep', () => ({
      hasDep: () => false
    }));
    const config = require('../jest.config');
    expect(config.testEnvironment).toEqual('node');
  });
});

describe('Sets the transform property on the jest config', () => {
  test('Uses the babel transform', () => {
    jest.mock('../../utils/fileExists', () => () => false);
    const config = require('../jest.config');
    expect(config.transform).toMatchSnapshot();
  });

  test('Does not use the babel transform', () => {
    jest.mock('../../utils/fileExists', () => () => true);
    const config = require('../jest.config');
    expect(config.transform).toMatchSnapshot();
  });
});
