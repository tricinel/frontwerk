/* eslint-disable global-require */
import {
  unquoteSerializer,
  winPathSerializer
} from '../../helpers/serializers';

const cases = require('jest-in-case');
const jestSerializerPath = require('jest-serializer-path');

expect.addSnapshotSerializer(unquoteSerializer);
expect.addSnapshotSerializer(winPathSerializer);
expect.addSnapshotSerializer(jestSerializerPath);

jest.mock('fs');
jest.mock('path');
jest.mock('../../utils/pkg.js');

const testCases = [
  {
    name: 'calls scaffold with no args',
    exitCode: 1
  },
  {
    name: '--all will scaffold all the config files',
    args: ['--all'],
    filesCreated: 7
  },
  {
    name: '--config will scaffold only the passed config files',
    args: ['--config=eslint,jest'],
    filesCreated: 2
  },
  {
    name:
      '--config will scaffold only the passed config files, if they exist in the list of default configs',
    args: ['--config=eslint,jest,missingConfigFile'],
    filesCreated: 2
  },
  {
    name: '--config will not scaffold anything if configs is empty',
    args: ['--config'],
    exitCode: 1
  },
  {
    name: `--config will skip config files that already exist in the user's appDirectory`,
    args: ['--config=eslint,jest,prettier'],
    filesCreated: 2,
    fileExists: filename => filename === 'prettier.config.js'
  },
  {
    name:
      '--config will skip config files that have a prop config in package.json',
    args: ['--config=eslint,jest,prettier'],
    filesCreated: 2,
    hasPkgProp: prop => prop === 'eslintConfig'
  }
];

const testFn = ({
  fileExists = () => false,
  hasPkgProp = () => false,
  filesCreated = 0,
  exitCode = 0,
  args = []
}) => {
  const originalExit = process.exit;
  const originalArgv = process.argv;
  process.exit = jest.fn();

  Object.assign(require('../../utils/fileExists'), { fileExists });
  Object.assign(require('../../utils/pkg'), { hasPkgProp });

  try {
    // tests
    process.argv = ['node', '../scaffold', ...args];

    require('../scaffold');
    const fs = require('fs');

    if (exitCode === 1) {
      expect(process.exit).toHaveBeenCalledWith(1);
    } else {
      expect(fs.writeFileSync).toHaveBeenCalledTimes(filesCreated);

      expect(process.exit).toHaveBeenCalledWith(0);
    }
  } catch (error) {
    throw error;
  } finally {
    // afterEach
    process.exit = originalExit;
    process.argv = originalArgv;
    jest.resetModules();
  }
};

cases('scaffold', testFn, testCases);
