const webpack = require('webpack');

const debug = process.env.NODE_ENV !== 'production';

const plugins = debug
  ? []
  : [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production')
        }
      }),
      new webpack.optimize.ModuleConcatenationPlugin(),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        sourcemap: false,
        compress: { drop_console: true }
      })
    ];

module.exports = plugins;
