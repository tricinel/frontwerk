const { fromRoot } = require('../fromRoot');

jest.mock('../appDirectory.js');

test('Get the path to a file starting from the root', () => {
  expect(fromRoot('foo', 'bar', 'file.js')).toEqual(
    'path/to/package/foo/bar/file.js'
  );
});
