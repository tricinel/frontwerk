const path = require('path');
const webpack = require('webpack');

const { appDirectory } = require('../utils/appDirectory');
const { hasDep } = require('../utils/hasDep');
const { parseEnv } = require('../utils/parseEnv');

const plugins = require('./webpack.plugins');

const debug = process.env.NODE_ENV !== 'production';
const defaultEntryExt = hasDep('react') ? 'jsx' : 'js';
const defaultEntry = `src/index.${defaultEntryExt}`;
const entry = path.join(appDirectory, parseEnv('BUILD_ENTRY', defaultEntry));

const outputPath = path.join(
  appDirectory,
  parseEnv('BUILD_OUTPUT_PATH', 'dist')
);

const config = {
  devtool: debug ? 'eval-source-map' : '',
  entry,
  output: {
    filename: '[name].[hash].js',
    path: outputPath
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    ...plugins,
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: module =>
        module.context && module.context.indexOf('node_modules') !== -1
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest'
    })
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: require.resolve('babel-loader'),
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [require.resolve('style-loader'), require.resolve('css-loader')]
      },
      {
        test: /\.(woff2?|eot|ttf|svg)$/,
        use: require.resolve('url-loader')
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        loaders: [
          {
            loader: require.resolve('file-loader'),
            options: {
              hash: 'sha512',
              digest: 'hex',
              name: '[name]-[hash].[ext]'
            }
          },
          {
            loader: require.resolve('image-webpack-loader'),
            options: {
              gifsicle: {
                interlaced: false
              },
              optipng: {
                optimizationLevel: 7
              },
              pngquant: {
                quality: '65-90',
                speed: 4
              },
              mozjpeg: {
                progressive: true,
                quality: 65
              }
            }
          }
        ],
        exclude: /node_modules/
      }
    ]
  }
};

module.exports = config;
