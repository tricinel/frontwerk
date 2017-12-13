const webpack = require('webpack');

const { appDirectory } = require('../utils/appDirectory');
const { hasDep } = require('../utils/hasDep');
const { parseEnv } = require('../utils/parseEnv');

const plugins = require('./webpack.plugins');

const debug = process.env.NODE_ENV !== 'production';
const defaultEntryExt = hasDep('react') ? 'jsx' : 'js';
const defaultEntry = `${appDirectory}/src/index.${defaultEntryExt}`;
const entry = parseEnv('BUILD_ENTRY', defaultEntry);

const outputPath = parseEnv('BUILD_OUTPUT_PATH', `${appDirectory}/dist`);

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
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(woff2?|eot|ttf|svg)$/,
        loader: 'url-loader'
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        loaders: [
          {
            loader: 'file-loader',
            options: {
              hash: 'sha512',
              digest: 'hex',
              name: '[name]-[hash].[ext]'
            }
          },
          {
            loader: 'image-webpack-loader',
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
