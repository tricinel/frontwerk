const fs = require('fs');
const path = require('path');
const yargsParser = require('yargs-parser');

const { error, warning, info, success } = require('../utils/logger');
const { fileExists } = require('../utils/fileExists');
const { appDirectory } = require('../utils/appDirectory');
const { hasPkgProp } = require('../utils/pkg');
const { defaultConfigs } = require('../utils/defaultConfigs');

const args = process.argv.slice(2);
const parsedArgs = yargsParser(args);

const hasAllOption = args.includes('--all');
const hasConfigOption = parsedArgs.config;

const allFiles = Object.keys(defaultConfigs);

let configs = [];

if (hasConfigOption && parsedArgs.config.length) {
  configs = [...parsedArgs.config.split(',')];
} else if (hasAllOption) {
  configs = [...allFiles];
}

// Ignore configs that the user passed in that are not part of the allFiles
const getFiles = cfgs =>
  cfgs.reduce(
    (all, cfg) => [...all, allFiles.includes(cfg) ? cfg : null].filter(Boolean),
    []
  );

const files = getFiles(configs);

if (!files.length) {
  error('You have not provided any config files...');
  process.exit(1);
}

const getContent = (file, filename) =>
  filename.includes('ignore')
    ? `build/
node_modules/
coverage/
dist/
`
    : `const { ${file}: ${file}Config } = require('frontwerk/config');

module.exports = Object.assign(${file}Config, {
  // your overrides here
});
`;

const createConfigFile = (file, filename) => {
  const content = getContent(file, filename);
  fs.writeFileSync(path.join(appDirectory, filename), content);
};

const configExists = ({ pkgProp, filename, additionalFilenames }) => {
  const allFilenames = [...additionalFilenames, filename].filter(Boolean);
  const configFileExists = allFilenames.filter(file => fileExists(file));

  return (pkgProp && hasPkgProp(pkgProp)) || configFileExists.length;
};

files.forEach(file => {
  const configFile = defaultConfigs[file];

  if (configExists(configFile)) {
    warning(
      `The file or package.json property for ${file} already exists in your directory! Skipping...`
    );
  } else {
    info(`Creating the ${file} file...`);
    createConfigFile(file, configFile.filename);
  }
});

success('All done...');
process.exit(0);
