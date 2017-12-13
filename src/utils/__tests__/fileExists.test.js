const { fileExists } = require('../fileExists');

jest.mock('fs');
jest.mock('../appDirectory.js');

const MOCK_FILE_INFO = ['path/to/package/file.js'];

beforeEach(() => {
  // eslint-disable-next-line global-require
  require('fs').setMockFiles(MOCK_FILE_INFO);
});

test('A file exists relative to the appDirectory', () => {
  expect(fileExists('file.js')).toBeTruthy();
});

test('A file does not exist relative to the appDirectory', () => {
  expect(fileExists('undefined.js')).toBeFalsy();
});
