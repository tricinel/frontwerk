import yargsParser from 'yargs-parser';
import { map, filter } from 'ramda';

import { hasPkgProp } from './pkg';
import fileExists from './fileExists';
import { files, pkgProps, cliArgs, Tools } from './checkToolConfig';
import { allFalse, allTrue } from './logic';

const args = process.argv.slice(2);
const parsedArgs = yargsParser(args);

const filesExist = (tool: Tools): boolean[] =>
  typeof tool === 'string' ? map(fileExists)(files[tool]) : [true];

const conditions = (tool: Tools): boolean[] => {
  const hasNoFiles: boolean = allFalse(filesExist(tool));
  let hasNoPkgProp = false;
  let hasNoCliArg = false;

  if (tool !== 'rollup') {
    hasNoPkgProp = !hasPkgProp(pkgProps[tool]);
    hasNoCliArg = !args.includes(`--${cliArgs[tool]}`);
  }

  return [hasNoFiles, hasNoPkgProp, hasNoCliArg];
};

const useBuiltinConfig = (tool: Tools): boolean => allTrue(conditions(tool));

const passedConfig = (tool: Tools): string | boolean => {
  // If the user passes a configuration flag
  if (args.includes(`--${cliArgs[tool]}`)) {
    return parsedArgs.config;
  }

  // If the user has their own configuration file
  // Make a list of all existing files
  const configFiles = filter(fileExists)(files[tool]);
  if (configFiles.length > 0) {
    return configFiles[0];
  }

  // If the user has setup a configuration inside their package.json
  // Rollup has no package.json property for configuration
  const pkgProp = tool === 'rollup' ? null : pkgProps[tool];

  if (hasPkgProp(pkgProp)) {
    return `${pkgProp} in package.json`;
  }

  // We got this far, so there is no passed in config
  return false;
};

const whichConfig = (tool?: Tools): string => {
  const defaultMsg = 'Using the builtin frontwerk config...';

  if (typeof tool === 'undefined') {
    return defaultMsg;
  }

  const config = passedConfig(tool);

  return typeof config === 'string'
    ? `Using your project's ${config} config...`
    : defaultMsg;
};

export { useBuiltinConfig, whichConfig };
