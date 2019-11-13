import fs from 'fs';
import path from 'path';
import which from 'which';

// All credit goes to https://github.com/kentcdodds/kcd-scripts/blob/master/src/utils.js#L21
// eslint-disable-next-line complexity
const resolveBin = (
  modName: string,
  { executable = modName, cwd = process.cwd() } = {}
): string => {
  let pathFromWhich;
  try {
    pathFromWhich = fs.realpathSync(which.sync(executable));
  } catch (_error) {
    // Ignore _error
  }
  try {
    const modPkgPath = require.resolve(`${modName}/package.json`); // eslint-disable-line global-require,@typescript-eslint/no-var-requires,@typescript-eslint/no-require-imports
    const modPkgDir = path.dirname(modPkgPath);
    const { bin } = require(modPkgPath); // eslint-disable-line global-require,import/no-dynamic-require,@typescript-eslint/no-var-requires,@typescript-eslint/no-require-imports
    const binPath = typeof bin === 'string' ? bin : bin[executable];
    const fullPathToBin = path.join(modPkgDir, binPath);
    if (fullPathToBin === pathFromWhich) {
      return executable;
    }
    return fullPathToBin.replace(cwd, '.');
  } catch (error) {
    if (typeof pathFromWhich === 'string') {
      return executable;
    }
    throw error;
  }
};

export default resolveBin;
