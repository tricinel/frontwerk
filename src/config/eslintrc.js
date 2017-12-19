const { hasDep } = require('../utils/hasDep');

const hasReact = hasDep('react');
const hasJest = hasDep('jest');
const hasJquery = hasDep('jquery');
const hasFlow = hasDep('flow');

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
    require.resolve('eslint-config-prettier')
  ].filter(Boolean),
  plugins: [
    'prettier',
    hasReact ? 'import' : false,
    hasReact ? 'react' : false,
    hasReact ? 'jsx-a11y' : false
  ].filter(Boolean),
  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: true
      }
    ],
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        parser: hasFlow ? 'flow' : 'babylon'
      }
    ],
    'comma-dangle': ['error', 'never'],
    'no-console': 0,
    'no-param-reassign': [
      'error',
      {
        props: false
      }
    ],
    'no-plusplus': [
      'error',
      {
        allowForLoopAfterthoughts: true
      }
    ]
  }
};
