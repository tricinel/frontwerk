/* eslint-disable global-require */
afterEach(() => {
  jest.resetModules();
});

test('Gets the eslint rules when there is React as a project dependency', () => {
  jest.mock('../../utils/hasDep', () => ({
    hasDep: (dep: string): boolean => dep === 'react'
  }));
  const rules = require('../eslint-rules');
  expect(rules.default).toMatchObject({
    'react/jsx-filename-extension': ['error', { extensions: ['.jsx'] }]
  });
});

test('Gets the eslint rules when there is both React and TypeScript as a project dependency', () => {
  jest.mock('../../utils/hasDep', () => ({
    hasDep: (dep: string): boolean => dep === 'react' || dep === 'typescript'
  }));
  const rules = require('../eslint-rules');
  expect(rules.default).toMatchObject({
    'react/jsx-filename-extension': [
      'error',
      { extensions: ['.jsx', '.ts', '.tsx'] }
    ]
  });
});
