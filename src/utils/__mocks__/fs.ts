import path from 'path';

interface FSMock {
  setMockFiles: (files: string[]) => void;
  existsSync: (path: string) => boolean;
}

const fs: FSMock = jest.genMockFromModule('fs');
let mockFiles: string[] = [];

const setMockFiles = (files: string[]): void => {
  mockFiles = files.map(file => `${path.dirname(file)}/${path.basename(file)}`);
};

const existsSync = (directoryPath: string): boolean =>
  mockFiles.includes(directoryPath);

fs.setMockFiles = setMockFiles;
fs.existsSync = existsSync;

export default fs;
