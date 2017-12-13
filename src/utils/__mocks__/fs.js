const path = require('path');

const fs = jest.genMockFromModule('fs');

let mockFiles = [];

const setMockFiles = files => {
  mockFiles = files.map(file => `${path.dirname(file)}/${path.basename(file)}`);
};

const existsSync = directoryPath => mockFiles.indexOf(directoryPath) !== -1;

fs.setMockFiles = setMockFiles;
fs.existsSync = existsSync;

module.exports = fs;
