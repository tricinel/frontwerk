import { hasDep } from '../hasDep';

test('Determine if a dependency exists', () => {
  expect(hasDep('DoesNotExist')).toBe(false);
  expect(hasDep('jest')).toBe(true);
  expect(hasDep()).toBe(false);
});
