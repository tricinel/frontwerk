import yargsParser from 'yargs-parser';
import { allPass, always, cond, F, identity, T } from 'ramda';

import { hasPkgProp } from './pkg';
import fileExists from './fileExists';
import { files, pkgProps, cliArgs, Tools } from './checkToolConfig';

const args = process.argv.slice(2);
const parsedArgs = yargsParser(args);

const filesDontExist = (tool: Tools): boolean[] =>
  typeof tool === 'string'
    ? files[tool].map(file => always(!fileExists(file)))
    : [T];

const filesExistConditions = (tool: Tools): boolean[] =>
  typeof tool === 'string'
    ? files[tool].map(file => [
        always(fileExists(file)),
        always(identity(file))
      ])
    : [F];

const conditions = (tool: Tools): boolean[] => {
  const hasNoFiles: boolean = allPass(filesDontExist(tool));
  const hasNoPkgProp: boolean = always(!hasPkgProp(pkgProps[tool]));
  const hasNoCliArg: boolean = always(!args.includes(`--${cliArgs[tool]}`));

  return [hasNoFiles, hasNoPkgProp, hasNoCliArg];
};

const useBuiltinConfig = (tool: Tools): boolean => allPass(conditions(tool))();

const passedConfig = (tool: Tools): string => {
  const pkgProp = pkgProps[tool];

  return cond([
    [always(args.includes(`--${cliArgs[tool]}`)), always(parsedArgs.config)],
    ...filesExistConditions(tool),
    [always(hasPkgProp(pkgProp)), always(`${pkgProp} in package.json`)]
  ])(tool);
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
