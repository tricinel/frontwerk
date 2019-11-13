import { toCamelCase, uncapitalize, capitalize } from '../strings';

test('Transform string to camel case', () => {
  expect(toCamelCase('Foo Bar')).toEqual('fooBar');
  expect(toCamelCase('--foo-bar--')).toEqual('fooBar');
  expect(toCamelCase('__FOO_BAR__')).toEqual('fooBar');
});

test('Capitalize a string', () => {
  expect(capitalize('foobar')).toEqual('Foobar');
  expect(capitalize('Foobar')).toEqual('Foobar');
  expect(capitalize('fooBAR')).toEqual('FooBAR');
});

test('Uncapitalize a string', () => {
  expect(uncapitalize('Foobar')).toEqual('foobar');
  expect(uncapitalize('foobar')).toEqual('foobar');
  expect(uncapitalize('fooBAR')).toEqual('fooBAR');
  expect(uncapitalize('FooBAR')).toEqual('fooBAR');
});
