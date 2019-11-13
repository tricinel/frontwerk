import fs from 'fs';
import path from 'path';
import { sync, PackageJson } from 'read-pkg-up';
import { flip, has } from 'ramda';

const defaultPkg: PackageJson = {
  packageJson: {
    name: 'app',
    dependencies: {},
    peerDependencies: {},
    devDependencies: {}
  },
  path: process.cwd()
};

// The user's package.json
const appPkgJson = sync({
  cwd: fs.realpathSync(process.cwd()),
  normalize: false
});
const pkg =
  typeof appPkgJson === 'undefined'
    ? defaultPkg.packageJson
    : appPkgJson.packageJson;
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
    : ownPkgJson.packageJson;
const ownPkgPath =
  typeof ownPkgJson === 'undefined' ? defaultPkg.path : ownPkgJson.path;

const hasPkgProp: (dep: string) => boolean = flip(has)(pkg);

export interface Dependency {
  [packageName: string]: string;
}

export { pkg, pkgPath, ownPkg, ownPkgPath, hasPkgProp };
