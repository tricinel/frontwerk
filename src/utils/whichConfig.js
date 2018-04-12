const yargsParser = require('yargs-parser');
const { allPass, always, cond, identity, T } = require('ramda');

const { hasPkgProp } = require('./pkg');
const { fileExists } = require('./fileExists');
const { files, pkgProps, cliArgs } = require('./checkToolConfig');

const args = process.argv.slice(2);
const parsedArgs = yargsParser(args);

const filesDontExist = tool =>
  tool ? files[tool].map(file => always(!fileExists(file))) : [T];

const filesExistConditions = tool =>
  files[tool].map(file => [always(fileExists(file)), always(identity(file))]);

const conditions = tool => {
  const hasNoFiles = allPass(filesDontExist(tool));
  const hasNoPkgProp = always(!hasPkgProp(pkgProps[tool]));
  const hasNoCliArg = always(!args.includes(`--${cliArgs[tool]}`));

  return [hasNoFiles, hasNoPkgProp, hasNoCliArg];
};

const useBuiltinConfig = tool => allPass(conditions(tool))();

const passedConfig = tool => {
  const pkgProp = pkgProps[tool];

  return cond([
    [always(args.includes(`--${cliArgs[tool]}`)), always(parsedArgs.config)],
    ...filesExistConditions(tool),
    [always(hasPkgProp(pkgProp)), always(`${pkgProp} in package.json`)]
  ])(tool);
};

const whichConfig = tool => {
  const config = passedConfig(tool);

  return config
    ? `Using your project's ${config} config...`
    : 'Using the builtin frontwerk config...';
};

module.exports = { useBuiltinConfig, whichConfig };
