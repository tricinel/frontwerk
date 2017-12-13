const { hasDep } = require('../utils/hasDep');
const { parseEnv } = require('../utils/parseEnv');

const isRollup = parseEnv('BUILD_ROLLUP', false);
const isUMD = process.env.BUILD_FORMAT === 'umd';
const treeshake = parseEnv('BUILD_TREESHAKE', isRollup);
const envModules = treeshake ? { modules: false } : {};
const envTargets = { browsers: ['last 2 version', 'ie 10', 'ie 11'] };

const envOptions = Object.assign({}, envModules, { targets: envTargets });

module.exports = {
  presets: [
    [require.resolve('babel-preset-env'), envOptions],
    hasDep('react') ? require.resolve('babel-preset-react') : false,
    hasDep('flow-bin') ? require.resolve('babel-preset-flow') : false
  ].filter(Boolean),
  plugins: [
    isRollup ? require.resolve('babel-plugin-external-helpers') : null,
    isUMD
      ? require.resolve('babel-plugin-transform-inline-environment-variables')
      : null,
    require.resolve('babel-plugin-transform-object-rest-spread'),
    require.resolve('babel-plugin-minify-dead-code-elimination')
  ].filter(Boolean)
};
