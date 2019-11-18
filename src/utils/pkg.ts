import fs from 'fs';
import path from 'path';
import { sync, PackageJson } from 'read-pkg-up';
import { flip, has } from 'ramda';

interface SafePackageJson {
  name: string;
  dependencies: Dependencies;
  peerDependencies: Dependencies;
  devDependencies: Dependencies;
}

interface Package {
  packageJson: SafePackageJson;
  path: string;
}

export interface Dependencies {
  [packageName: string]: string;
}

const defaultPkg: Package = {
  packageJson: {
    name: 'app',
    dependencies: {},
    peerDependencies: {},
    devDependencies: {}
  },
  path: process.cwd()
};

const ensurePackageJson = (
  pkgJson: PackageJson,
  defaultPkgJson: SafePackageJson
): SafePackageJson => {
  if (typeof pkgJson === 'undefined') {
    return defaultPkgJson;
  }

  return {
    name: typeof pkgJson.name === 'string' ? pkgJson.name : defaultPkgJson.name,
    dependencies:
      typeof pkgJson.dependencies === 'undefined'
        ? defaultPkgJson.dependencies
        : pkgJson.dependencies,
    devDependencies:
      typeof pkgJson.devDependencies === 'undefined'
        ? defaultPkgJson.devDependencies
        : pkgJson.devDependencies,
    peerDependencies:
      typeof pkgJson.peerDependencies === 'undefined'
        ? defaultPkgJson.peerDependencies
        : pkgJson.peerDependencies
  };
};

// The user's package.json
const appPkgJson = sync({
  cwd: fs.realpathSync(process.cwd()),
  normalize: false
});
const pkg =
  typeof appPkgJson === 'undefined'
    ? defaultPkg.packageJson
    : ensurePackageJson(appPkgJson.packageJson, defaultPkg.packageJson);
const pkgPath =
  typeof appPkgJson === 'undefined' ? defaultPkg.path : appPkgJson.path;

// Frontwerk's package.json
const ownPkgJson = sync({
  cwd: fs.realpathSync(path.join(__dirname, '../../')),
  normalize: false
});
const ownPkg =
  typeof ownPkgJson === 'undefined'
    ? defaultPkg.packageJson
    : ensurePackageJson(ownPkgJson.packageJson, defaultPkg.packageJson);
const ownPkgPath =
  typeof ownPkgJson === 'undefined' ? defaultPkg.path : ownPkgJson.path;

const hasPkgProp = (dep: string | null): boolean =>
  typeof dep === 'string' && flip(has)(pkg)(dep);

export { pkg, pkgPath, ownPkg, ownPkgPath, hasPkgProp };
