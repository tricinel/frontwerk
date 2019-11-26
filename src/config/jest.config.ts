import { hasPkgProp } from '../utils/pkg';
import { hasDep } from '../utils/hasDep';
import fromRoot from '../utils/fromRoot';
import fileExists from '../utils/fileExists';

const useBuiltInBabelConfig = !(
  fileExists('.babelrc') ||
  fileExists('babel.config.js') ||
  hasPkgProp('babel')
);

const ignores = [
  '/node_modules/',
  '/fixtures/',
  '/__tests__/helpers/',
  '__mocks__'
];

const threshold = 80;

const config = {
  roots: [fromRoot('src')],
  testEnvironment: hasDep('rollup') || hasDep('react') ? 'jsdom' : 'node',
  collectCoverageFrom: ['src/**/*.+(js|jsx|ts|tsx)'],
  testMatch: ['**/__tests__/**/*.+(js|jsx|ts|tsx)'],
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
  ],
  ...(useBuiltInBabelConfig && {
    transform: {
      '^.+\\.[t|j]sx?$': 'babel-jest'
    }
  })
};

export default config;
module.exports = config;
