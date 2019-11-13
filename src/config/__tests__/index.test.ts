/* eslint-disable global-require */

test('requiring some files does not blow up', () => {
  expect(() => {
    require('../index');
    require('../babelrc');
    require('../eslint-rules');
    require('../eslintrc');
    require('../jest.config');
    require('../prettierrc');
    require('../rollup.config');
    require('../stylelint.config');
  }).not.toThrow();
});
