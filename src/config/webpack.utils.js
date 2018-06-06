/*
 * Heavily inspired from @timurcatakli
 * https://medium.com/@timurcatakli/an-easy-to-understand-webpack-4-configuration-file-with-comments-6213882e9edf
*/

const webpack = require('webpack');
const UglifyWebpackPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const cssnano = require('cssnano');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const autoprefixer = require('autoprefixer');
const postcssFlexbugsFixes = require('postcss-flexbugs-fixes');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const cssRegex = /\.css$/;
const jsRegex = /\.(js|jsx)$/;
const fileRegex = /\.(png|jpg|jpeg|gif|eot|ttf|woff2)$/;

const minifyJavaScript = ({ sourceMap }) => ({
  optimization: {
    minimizer: [
      new UglifyWebpackPlugin({
        uglifyOptions: {
          parse: { ecma: 8 },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false
          },
          mangle: { safari10: true },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true
          }
        },
        parallel: true,
        cache: true,
        sourceMap
      })
    ]
  }
});

const minifyCSS = ({ options = {} }) => ({
  plugins: [
    new OptimizeCSSAssetsPlugin({
      cssProcessor: cssnano,
      cssProcessorOptions: options,
      canPrint: false
    })
  ]
});

const loadJavaScript = ({ exclude } = {}) => ({
  module: {
    rules: [
      {
        test: jsRegex,
        exclude,
        use: require.resolve('babel-loader')
      }
    ]
  }
});

const ignoreErrors = () => new webpack.NoEmitOnErrorsPlugin();

const cleanup = path => ({
  plugins: [new CleanWebpackPlugin([path])]
});

const loadCSS = ({ exclude, env } = {}) => {
  const module = {
    module: {
      rules: [
        {
          test: cssRegex,
          exclude,
          use: [
            require.resolve('style-loader'),
            {
              loader: require.resolve('css-loader'),
              options:
                env === 'production'
                  ? { minimize: true }
                  : { sourceMap: true, minimize: false }
            },
            {
              loader: require.resolve('postcss-loader'),
              options: {
                ident: 'postcss',
                plugins: () => [
                  postcssFlexbugsFixes,
                  autoprefixer({ flexbox: 'no-2009' })
                ]
              }
            }
          ]
        }
      ]
    }
  };

  if (env === 'production') {
    module.module.rules[0].use.push(MiniCssExtractPlugin.loader);
    module.plugins = [
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css'
      })
    ];
  }

  return module;
};

const splitChunks = name => ({
  optimization: {
    splitChunks: {
      chunks: 'all',
      name
    },
    runtimeChunk: true
  }
});

const loadImages = ({ include, exclude, options } = {}) => ({
  module: {
    rules: [
      {
        test: fileRegex,
        include,
        exclude,
        use: {
          loader: require.resolve('url-loader'),
          options
        }
      }
    ]
  }
});

const setCompression = () => ({
  plugins: [new CompressionPlugin()]
});

const caseSensitivePaths = () => ({
  plugins: [new CaseSensitivePathsPlugin()]
});

const generateHTML = ({ template, minify }) => ({
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template,
      minify
    })
  ]
});

const ignorePlugin = regex => ({
  plugins: [new webpack.IgnorePlugin(regex)]
});

const setAnalyzer = () => ({
  plugins: [new BundleAnalyzerPlugin()]
});

module.exports = {
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
  setAnalyzer,
  setCompression,
  splitChunks
};
