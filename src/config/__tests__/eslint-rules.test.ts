/* eslint-disable global-require */

afterEach(() => {
  jest.resetModules();
});

test('Gets the eslint rules when there is Flow as a project dependency', () => {
  jest.mock('../../utils/hasDep', () => ({
    hasDep: (dep: string): boolean => dep === 'flow'
  }));
  const config = require('../eslint-rules');
  expect(config.rules['prettier/prettier'][1].parser).toEqual('flow');
});
