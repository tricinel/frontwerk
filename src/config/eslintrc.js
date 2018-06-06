const { hasDep } = require('../utils/hasDep');
const rules = require('./eslint-rules');

const hasReact = hasDep('react');
const hasJquery = hasDep('jquery');

module.exports = {
  env: {
    browser: true,
    node: true,
    jest: true,
    jquery: hasJquery
  },
  parser: require.resolve('babel-eslint'),
  extends: [
    hasReact
      ? require.resolve('eslint-config-airbnb')
      : require.resolve('eslint-config-airbnb-base'),
    require.resolve('eslint-config-prettier'),
    'plugin:jest/recommended'
  ].filter(Boolean),
  plugins: [
    'prettier',
    'jest',
    hasReact ? 'import' : false,
    hasReact ? 'react' : false,
    hasReact ? 'jsx-a11y' : false
  ].filter(Boolean),
  ...rules
};
