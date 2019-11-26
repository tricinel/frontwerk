import fs from 'fs';
import path from 'path';

import {
  pipe,
  union,
  indexOf,
  keys,
  uniq,
  flatten,
  map,
  reduce,
  pick,
  values
} from 'ramda';

import appDirectory from './appDirectory';
import { pkg } from './pkg';
import { allTrue, anyTrue } from './logic';

// Figure out if the dependency is declared in package.json
// And if it is present in the node_modules folder
const hasDep = (dep: string): boolean => {
  // All the declared dependencies inside of package.json
  const declaredDeps = pipe(
    pick(['dependencies', 'devDependencies', 'peerDependencies']),
    values,
    map(keys),
    flatten,
    uniq
  )(pkg);

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
  const deps = union(availableDeps, declaredDeps);

  return indexOf(dep, deps) !== -1;
};

const hasAllDeps = <T>(deps: string[], lhs: T, rhs = false): T | boolean =>
  allTrue(deps.map(hasDep)) ? lhs : rhs;
const hasAnyDeps = <T>(deps: string[], lhs: T, rhs = false): T | boolean =>
  anyTrue(deps.map(hasDep)) ? lhs : rhs;

export { hasDep, hasAllDeps, hasAnyDeps };
