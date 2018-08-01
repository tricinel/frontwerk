const fs = require('fs');
const path = require('path');

const {
  compose,
  concat,
  indexOf,
  keys,
  merge,
  reduce,
  uniq
} = require('ramda');

const { appDirectory } = require('./appDirectory');
const { pkg } = require('./pkg');

const hasDep = dep => {
  const declaredDeps = compose(keys, merge)(
    pkg.dependencies,
    pkg.devDependencies,
    pkg.peerDepedencies
  );

  const getDirectories = srcpath =>
    fs
      .readdirSync(srcpath)
      .filter(file => fs.statSync(path.join(srcpath, file)).isDirectory());

  const createDirectories = (acc, curr) => {
    if (curr !== '.bin') {
      acc.push(curr);
    }

    return acc;
  };

  const directories = getDirectories(`${appDirectory}/node_modules/`);
  const availableDeps = reduce(createDirectories, [], directories);
  const deps = compose(uniq, concat)(availableDeps, declaredDeps);

  return indexOf(dep, deps) !== -1;
};

module.exports = { hasDep };
