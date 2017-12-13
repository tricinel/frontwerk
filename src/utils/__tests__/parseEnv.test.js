const { parseEnv } = require('../parseEnv');

beforeAll(() => {
  delete process.env.BUILD_MINIFY;
  process.env.BUILD_MINIFY = true;
});

test('Parses the env name, returning that or a default', () => {
  expect(parseEnv('BUILD_MINIFY')).toBeTruthy();
  expect(parseEnv('NOT_SET', 'development')).toEqual('development');
});
