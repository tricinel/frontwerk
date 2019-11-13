import fromRoot from '../fromRoot';

jest.mock('../appDirectory.ts');

test('Get the path to a file starting from the root', () => {
  expect(fromRoot('foo', 'bar', 'file.js')).toEqual(
    'path/to/package/foo/bar/file.js'
  );
});
