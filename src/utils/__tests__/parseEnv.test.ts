/* eslint no-process-env: "off" */

import parseEnv from '../parseEnv';

beforeAll(() => {
  delete process.env.BUILD_MINIFY;
  process.env.BUILD_MINIFY = 'true';
});

test('Parses the env name, returning that or a default', () => {
  expect(parseEnv<boolean>('BUILD_MINIFY', false)).toBeTruthy();
  expect(parseEnv<string>('NOT_SET', 'development')).toEqual('development');
});
