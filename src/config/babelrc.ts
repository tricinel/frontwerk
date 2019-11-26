import { TransformOptions, PluginItem, ConfigAPI } from '@babel/core';

import { hasDep } from '../utils/hasDep';
import parseEnv from '../utils/parseEnv';

const isRollup = parseEnv<boolean>('BUILD_ROLLUP', false);
const isUMD = parseEnv<string>('BUILD_FORMAT') === 'umd';
const isCJS = parseEnv<string>('BUILD_FORMAT') === 'cjs';
const treeshake = parseEnv<boolean>('BUILD_TREESHAKE', isRollup);
const envModules = treeshake ? { modules: false } : {};
const envTargets = {
  browsers: ['last 2 version', 'ie 10', 'ie 11'],
  node: 'current'
};

const envOptions = { ...envModules, targets: envTargets };

const config = (api: ConfigAPI): TransformOptions => {
  api.cache.forever();
  return {
    presets: [
      [require.resolve('@babel/preset-env'), envOptions],
      hasDep('react') ? require.resolve('@babel/preset-react') : null,
      hasDep('typescript') ? require.resolve('@babel/preset-typescript') : null
    ].filter(Boolean) as PluginItem[],
    plugins: [
      [
        require.resolve('@babel/plugin-transform-runtime'),
        { useESModules: treeshake && !isCJS }
      ],
      isRollup ? require.resolve('@babel/plugin-external-helpers') : null,
      isUMD
        ? require.resolve('babel-plugin-transform-inline-environment-variables')
        : null,
      require.resolve('babel-plugin-minify-dead-code-elimination'),
      treeshake
        ? require.resolve('@babel/plugin-transform-modules-commonjs')
        : null
    ].filter(Boolean) as PluginItem[]
  };
};

export default config;
