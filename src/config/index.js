const babel = require('./babelrc');
const eslint = require('./eslintrc');
const jest = require('./jest.config');
const stylelint = require('./stylelint.config');
const flow = require('./flowconfig');
const webpack = require('./webpack.config');
const rollup = require('./rollup.config');

module.exports = {
  babel,
  eslint,
  jest,
  stylelint,
  flow,
  webpack,
  rollup
};
