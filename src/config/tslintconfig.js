const { hasDep } = require('../utils/hasDep');
const rules = require('./tslint-rules');

const hasReact = hasDep('react');

module.exports = {
  extends: hasReact ? require.resolve('tslint-react') : 'tslint:recommended',
  linterOptions: {
    exclude: ['node_modules/**', 'dist/**']
  },
  ...rules
};
