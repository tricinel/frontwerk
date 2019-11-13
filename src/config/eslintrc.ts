import appDirectory from '../utils/appDirectory';
import { hasDep } from '../utils/hasDep';
import rules from './eslint-rules';

const hasReact = hasDep('react');
const hasTypescript = hasDep('typescript');
const hasJquery = hasDep('jquery');

const config = {
  env: {
    browser: true,
    node: true,
    jest: true,
    jquery: hasJquery
  },
  extends: [
    !hasReact && !hasTypescript
      ? require.resolve('eslint-config-frontwerk')
      : null,
    hasReact ? require.resolve('eslint-config-frontwerk-react') : null,
    hasTypescript
      ? require.resolve('eslint-config-frontwerk-typescript')
      : null,
    hasTypescript ? 'prettier/@typescript-eslint' : null,
    require.resolve('eslint-config-prettier'),
    'plugin:prettier/recommended',
    'plugin:jest/recommended'
  ].filter(Boolean),
  plugins: ['jest'],
  parserOptions: hasTypescript
    ? {
        tsconfigRootDir: appDirectory,
        project: './tsconfig.json'
      }
    : {},
  rules: {
    ...rules
  }
};

export default config;
module.exports = config;
