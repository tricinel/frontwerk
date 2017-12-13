const { hasPkgProp } = require('../pkg');

test('Determine if package.json has a property', () => {
  expect(hasPkgProp('dependencies')).toBe(true);
  expect(hasPkgProp('DoesNotExist')).toBe(false);
});
