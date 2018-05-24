const path = require('path');
const merge = require('webpack-merge');

const { appDirectory } = require('../utils/appDirectory');
const { hasDep } = require('../utils/hasDep');
const { parseEnv } = require('../utils/parseEnv');
const { fileExists } = require('../utils/fileExists');
const { start } = require('../utils/logger');
const {
  caseSensitivePaths,
  cleanup,
  generateHTML,
  ignoreErrors,
  ignorePlugin,
  loadCSS,
  loadImages,
  loadJavaScript,
  minifyCSS,
  minifyJavaScript,
  setCompression,
  splitChunks
} = require('./webpack.utils');

const defaultEntryExt = hasDep('react') ? 'jsx' : 'js';
const defaultEntry = `src/index.${defaultEntryExt}`;

const outputPath = path.join(
  appDirectory,
  parseEnv('BUILD_OUTPUT_PATH', 'dist')
);

const cliMode = parseEnv('WEBPACK_MODE', 'development');
const skipClean = parseEnv('WEBPACK_NO_CLEAN', false);

const indexHtmlTemplate = 'src/index.html';
const indexHtmlTemplateExists = fileExists(indexHtmlTemplate);

const common = merge([
  {
    entry: {
      application: path.join(
        appDirectory,
        parseEnv('BUILD_ENTRY', defaultEntry)
      )
    }
  },
  splitChunks(),
  caseSensitivePaths(),
  ignorePlugin(/^\.\/locale$/, /moment$/)
]);

const production = merge([
  {
    mode: 'production',
    devtool: false,
    bail: false,
    output: {
      filename: '[name].js',
      path: outputPath,
      pathinfo: true,
      publicPath: '/'
    }
  },
  ignoreErrors(),
  loadJavaScript({ exclude: /node_modules/ }),
  minifyJavaScript({ sourceMap: false }),
  skipClean ? {} : cleanup(outputPath),
  minifyCSS({
    options: {
      discardComments: { removeAll: true }
    },
    safe: true
  }),
  loadCSS({ env: 'production' }),
  loadImages({
    options: {
      limit: 1024,
      name: '[name].[ext]'
    }
  }),
  setCompression(),
  indexHtmlTemplateExists
    ? generateHTML({
        template: indexHtmlTemplate,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true
        }
      })
    : {}
]);

const development = merge([
  {
    mode: 'development',
    devtool: 'source-map',
    bail: true,
    watch: true,
    output: {
      filename: '[name].js',
      chunkFilename: '[id].js',
      path: outputPath,
      pathinfo: true,
      publicPath: '/'
    }
  },
  loadJavaScript({ exclude: /node_modules/ }),
  loadCSS({
    options: {
      sourceMap: true,
      minimize: true
    },
    env: 'development'
  }),
  loadImages(),
  indexHtmlTemplateExists
    ? generateHTML({
        template: indexHtmlTemplate,
        minify: {}
      })
    : {}
]);

module.exports = (mode = cliMode) => {
  start(`============= Running webpack in ${mode} mode =============`);
  const config = mode === 'production' ? production : development;
  return merge(common, config, { mode });
};
