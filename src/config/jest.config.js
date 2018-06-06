const path = require('path');

const { hasPkgProp } = require('../utils/pkg');
const { hasDep } = require('../utils/hasDep');
const { fromRoot } = require('../utils/fromRoot');
const { fileExists } = require('../utils/fileExists');

const useBuiltInBabelConfig = !fileExists('.babelrc') && !hasPkgProp('babel');

const ignores = [
  '/node_modules/',
  '/fixtures/',
  '/__tests__/helpers/',
  '__mocks__'
];

const threshold = 80;

const jestConfig = {
  roots: [fromRoot('src')],
  testEnvironment:
    hasDep('webpack') || hasDep('rollup') || hasDep('react') ? 'jsdom' : 'node',
  collectCoverageFrom: ['src/**/*.+(js|jsx)'],
  testMatch: ['**/__tests__/**/*.+(js|jsx)'],
  testPathIgnorePatterns: [...ignores],
  coveragePathIgnorePatterns: [
    ...ignores,
    'src/(umd|cjs|esm)-entry.js$',
    '.stories.js$'
  ],
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
  coverageThreshold: {
    global: {
      branches: threshold,
      functions: threshold,
      lines: threshold,
      statements: threshold
    }
  },
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ]
};

if (useBuiltInBabelConfig) {
  jestConfig.transform = {
    '^.+\\.(js|jsx)$': path.join(__dirname, './babel-transform')
  };
}

module.exports = jestConfig;
