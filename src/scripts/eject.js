// @skip-file-on-eject

const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const mkdirp = require('mkdirp');
const spawn = require('cross-spawn');

const { warning, error, info, success } = require('../utils/logger');
const { fileExists } = require('../utils/fileExists');
const { appDirectory } = require('../utils/appDirectory');
const { fromRoot } = require('../utils/fromRoot');
const { pkg, pkgPath, ownPkg } = require('../utils/pkg');

const { compose, indexOf, merge, omit } = require('ramda');

const ownPath = path.join(__dirname, '../');
const folders = ['config', 'scripts', 'utils'];

const collectFiles = (files, folder) =>
  files.concat(
    fs
      .readdirSync(path.join(ownPath, folder))
      .map(file => path.join(ownPath, folder, file))
      .filter(file => fs.lstatSync(file).isFile())
  );

const copyFile = file => {
  const content = fs.readFileSync(file, 'utf8');
  // Skip flagged files
  if (content.match(/\/\/ @skip-file-on-eject/)) {
    return;
  }
  info(`Adding ${file.replace(ownPath, '')} to your project...`);
  fs.writeFileSync(file.replace(ownPath, `${appDirectory}/`), content);
};

process.on('unhandledRejection', err => {
  throw err;
});

const handleEject = answer => {
  if (!answer.shouldEject) {
    warning('Close one! Eject aborted.');
    return;
  }

  info('Ejecting...');

  // Collect a list of files that need to be copied over
  const files = folders.reduce(collectFiles, []);

  // Create the folders in the app directory
  folders.forEach(folder => {
    if (fileExists(folder)) {
      error(
        `The folder ${folder} already exists in your app directory!`,
        'Please remove it and try again!'
      );

      process.exit(1);
    }

    info(`Creating the ${folder} folder...`);

    mkdirp.sync(fromRoot(folder));
  });

  // Copy all the files to their respective folders in the app directory
  files.forEach(copyFile);

  // Remove the package and its binaries from the app's node_modules
  try {
    Object.keys(ownPkg.bin).forEach(k =>
      fs.removeSync(path.join(appDirectory, 'node_modules', '.bin', k))
    );
    fs.removeSync(path.join(appDirectory, 'node_modules', pkg.name));
  } catch (e) {
    warning(`Could not remove ${pkg.name}'s folder from node_modules...`);
  }

  // Get the list of dependencies
  const ownDeps = ownPkg.dependencies;
  const appDeps = indexOf(pkg.name, pkg.dependencies)
    ? pkg.dependencies
    : pkg.devDependencies;

  const deps = compose(omit([pkg.name]), merge)(ownDeps, appDeps);

  // TODO: Remove the pkg.name from both dev and deps

  // Update the app package.json file
  pkg.devDependencies = deps;
  fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);

  // Run the install
  info('Running npm install...');

  // TODO: Handle install errors
  spawn.sync('npm', ['install', '--loglevel', 'error'], { stdio: 'inherit' });

  success('Ejected successfully!');
  info('Please update any paths in your configs.');
};

inquirer
  .prompt({
    type: 'confirm',
    name: 'shouldEject',
    message: 'Are you sure you want to eject? This action is permanent.',
    default: false
  })
  .then(handleEject);
