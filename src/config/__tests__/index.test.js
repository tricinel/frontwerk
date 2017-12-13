/* eslint-disable global-require */

test('requiring some files does not blow up', () => {
  require('../index');
  require('../babel-transform');
  require('../prettierrc');
});
