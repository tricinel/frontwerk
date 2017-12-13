const fs = require('fs');
const path = require('path');
const which = require('which');

// All credit goes to https://github.com/kentcdodds/kcd-scripts/blob/master/src/utils.js#L21
// eslint-disable-next-line complexity
const resolveBin = (
  modName,
  { executable = modName, cwd = process.cwd() } = {}
) => {
  let pathFromWhich;
  try {
    pathFromWhich = fs.realpathSync(which.sync(executable));
  } catch (_error) {
    // ignore _error
  }
  try {
    const modPkgPath = require.resolve(`${modName}/package.json`); // eslint-disable-line global-require
    const modPkgDir = path.dirname(modPkgPath);
    const { bin } = require(modPkgPath); // eslint-disable-line global-require,import/no-dynamic-require
    const binPath = typeof bin === 'string' ? bin : bin[executable];
    const fullPathToBin = path.join(modPkgDir, binPath);
    if (fullPathToBin === pathFromWhich) {
      return executable;
    }
    return fullPathToBin.replace(cwd, '.');
  } catch (error) {
    if (pathFromWhich) {
      return executable;
    }
    throw error;
  }
};

module.exports = { resolveBin };
