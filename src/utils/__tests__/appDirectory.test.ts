import appDirectory from '../appDirectory';

jest.mock('../pkg.ts');

test('Get the correct app directory', () => {
  expect(appDirectory).toEqual('path/to/package');
});
