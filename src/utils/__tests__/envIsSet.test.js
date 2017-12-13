const { envIsSet } = require('../envIsSet');

beforeAll(() => {
  delete process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';
});

test('Should detect that the env is set', () => {
  expect(envIsSet('NODE_ENV')).toBeTruthy();
  expect(envIsSet('NOT_SET')).toBeFalsy();
});
