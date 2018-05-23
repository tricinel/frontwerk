const { hasDep } = require('../utils/hasDep');
const rules = require('./eslint-rules');

const hasReact = hasDep('react');
const hasJest = hasDep('jest');
const hasJquery = hasDep('jquery');

module.exports = {
  env: {
    browser: true,
    node: true,
    jest: hasJest,
    jquery: hasJquery
  },
  parser: require.resolve('babel-eslint'),
  extends: [
    hasReact
      ? require.resolve('eslint-config-airbnb')
      : require.resolve('eslint-config-airbnb-base'),
    require.resolve('eslint-config-prettier'),
    hasJest ? 'plugin:jest/recommended' : null
  ].filter(Boolean),
  plugins: [
    'prettier',
    hasJest ? 'jest' : false,
    hasReact ? 'import' : false,
    hasReact ? 'react' : false,
    hasReact ? 'jsx-a11y' : false
  ].filter(Boolean),
  ...rules
};
