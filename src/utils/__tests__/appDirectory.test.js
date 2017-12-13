const { appDirectory } = require('../appDirectory');

jest.mock('../pkg.js');

test('Get the correct app directory', () => {
  expect(appDirectory).toEqual('path/to/package');
});
