const fs = require('fs');
const path = require('path');
const readPkgUp = require('read-pkg-up');

const { flip, has } = require('ramda');

const { pkg, path: pkgPath } = readPkgUp.sync({
  cwd: fs.realpathSync(process.cwd())
});

const { pkg: ownPkg, path: ownPkgPath } = readPkgUp.sync({
  cwd: fs.realpathSync(path.join(__dirname, '../../'))
});

const hasPkgProp = flip(has)(pkg);

module.exports = { pkg, pkgPath, ownPkg, ownPkgPath, hasPkgProp };
