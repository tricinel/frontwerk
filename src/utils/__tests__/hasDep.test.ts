import { hasAllDeps, hasAnyDeps, hasDep } from '../hasDep';

test('Determine if a dependency exists', () => {
  expect(hasDep('DoesNotExist')).toBe(false);
  expect(hasDep('jest')).toBe(true);
  // @ts-ignore
  expect(hasDep()).toBe(false);
});

test('Determine if all of the listed dependencies exist', () => {
  expect(hasAllDeps<string>(['jest', 'rollup'], 'success')).toEqual('success');
  expect(hasAllDeps<string>(['does-not-exist'], 'success')).toBe(false);
});

test('Determine if any of listed dependencies exist', () => {
  expect(hasAnyDeps<string>(['jest', 'does-not-exist'], 'success')).toEqual(
    'success'
  );
  expect(hasAnyDeps<string>(['does-not-exist'], 'success')).toBe(false);
});
