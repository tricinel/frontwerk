import fs from 'fs';
import path from 'path';

import {
  compose,
  concat,
  indexOf,
  keys,
  merge,
  reduce,
  uniq,
  allPass,
  anyPass
} from 'ramda';

import appDirectory from './appDirectory';
import { pkg } from './pkg';

const hasDep = (dep: string): boolean => {
  const declaredDeps = compose(
    keys,
    merge
  )(pkg.dependencies, pkg.devDependencies, pkg.peerDepedencies);

  const getDirectories = (srcpath: string): string[] =>
    fs
      .readdirSync(srcpath)
      .filter(file => fs.statSync(path.join(srcpath, file)).isDirectory());

  const createDirectories = (acc: string[], curr: string): string[] => {
    if (curr !== '.bin') {
      acc.push(curr);
    }

    return acc;
  };

  const directories = getDirectories(`${appDirectory}/node_modules/`);
  const availableDeps = reduce(createDirectories, [], directories);
  const deps = compose(
    uniq,
    concat
  )(availableDeps, declaredDeps);

  return indexOf(dep, deps) !== -1;
};

const hasAllDeps = <T>(deps: string[], lhs: T, rhs = false): T | boolean =>
  (allPass(deps.map(hasDep)) as boolean) ? lhs : rhs;
const hasAnyDeps = <T>(deps: string[], lhs: T, rhs = false): T | boolean =>
  (anyPass(deps.map(hasDep)) as boolean) ? lhs : rhs;

export { hasDep, hasAllDeps, hasAnyDeps };
