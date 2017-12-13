const fs = require('fs');
const readPkgUp = require('read-pkg-up');

const { flip, has } = require('ramda');

const { pkg, path: pkgPath } = readPkgUp.sync({
  cwd: fs.realpathSync(process.cwd())
});

const hasPkgProp = flip(has)(pkg);

module.exports = { pkg, pkgPath, hasPkgProp };
