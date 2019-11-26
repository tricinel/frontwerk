import fs from 'fs';

import fileExists from '../fileExists';

jest.mock('fs');
jest.mock('../appDirectory.ts');

beforeEach(() => {
  fs.existsSync = jest.fn(file => file === 'path/to/package/file.js');
});

test('A file exists relative to the appDirectory', () => {
  expect(fileExists('file.js')).toBeTruthy();
});

test('A file does not exist relative to the appDirectory', () => {
  expect(fileExists('undefined.js')).toBeFalsy();
});
