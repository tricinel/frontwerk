const { hasDep } = require('../utils/hasDep');

const hasFlow = hasDep('flow');

module.exports = {
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
    ],
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
  }
};
