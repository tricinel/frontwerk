/* eslint-disable global-require */
jest.mock('jest');

const cases = require('jest-in-case');

const useBuiltinConfigTestCases = [
  {
    name: 'use built in config'
  }
];

const useProjectConfigTestCases = [
  {
    name: 'eslint --config cli arg is passed',
    tool: 'eslint',
    args: ['--config', './custom.js']
  },
  {
    name: 'eslint eslingConfig pkg prop is used',
    tool: 'eslint',
    hasPkgProp: prop => prop === 'eslintConfig'
  },
  {
    name: 'eslint .eslintrc file exists',
    tool: 'eslint',
    fileExists: filename => filename === '.eslintrc'
  },
  {
    name: 'eslint .eslintrc.js file exists',
    tool: 'eslint',
    fileExists: filename => filename === '.eslintrc.js'
  },
  {
    name: 'babel --presets cli arg is passed',
    tool: 'babel',
    args: ['--presets', './custom.js']
  },
  {
    name: 'babel babel pkg prop is used',
    tool: 'babel',
    hasPkgProp: prop => prop === 'babel'
  },
  {
    name: 'babel .babelrc file exists',
    tool: 'babel',
    fileExists: filename => filename === '.babelrc'
  },
  {
    name: 'prettier --config cli arg is passed',
    tool: 'prettier',
    args: ['--config', './custom.js']
  },
  {
    name: 'prettier prettierrc pkg prop is used',
    tool: 'prettier',
    hasPkgProp: prop => prop === 'prettierrc'
  },
  {
    name: 'prettier .prettierrc file exists',
    tool: 'prettier',
    fileExists: filename => filename === '.prettierrc'
  },
  {
    name: 'prettier prettier.config.js file exists',
    tool: 'prettier',
    fileExists: filename => filename === 'prettier.config.js'
  },
  {
    name: 'rollup rollup.config.js file exists',
    tool: 'rollup',
    fileExists: filename => filename === 'rollup.config.js'
  },
  {
    name: 'stylelint --config cli arg is passed',
    tool: 'stylelint',
    args: ['--config', './custom.js']
  },
  {
    name: 'stylelint stylelint pkg prop is used',
    tool: 'stylelint',
    hasPkgProp: prop => prop === 'stylelint'
  },
  {
    name: 'stylelint .stylelintrc file exists',
    tool: 'stylelint',
    fileExists: filename => filename === '.stylelintrc'
  },
  {
    name: 'stylelint stylelint.config.js file exists',
    tool: 'stylelint',
    fileExists: filename => filename === 'stylelint.config.js'
  },
  {
    name: 'jest --config cli arg is passed',
    tool: 'jest',
    args: ['--config', './custom.js']
  },
  {
    name: 'jest jest pkg prop is used',
    tool: 'jest',
    hasPkgProp: prop => prop === 'jest'
  },
  {
    name: 'jest jest.config.js file exists',
    tool: 'jest',
    fileExists: filename => filename === 'jest.config.js'
  },
  {
    name: 'webpack --config cli arg is passed',
    tool: 'webpack',
    args: ['--config', './custom.js']
  },
  {
    name: 'webpack webpack.config.js file exists',
    tool: 'webpack',
    fileExists: filename => filename === 'webpack.config.js'
  }
];

const useBuiltinConfigTestFn = ({
  fileExists = () => false,
  hasPkgProp = () => false,
  tool = '',
  args = []
}) => {
  const originalArgv = process.argv;

  Object.assign(require('../fileExists'), { fileExists });
  Object.assign(require('../pkg'), { hasPkgProp });

  try {
    process.argv = ['node', 'whichConfig', ...args];

    const { useBuiltinConfig } = require('../whichConfig');

    // tests
    expect(useBuiltinConfig(tool)).toBe(true);
  } catch (error) {
    throw error;
  } finally {
    // afterEach
    process.argv = originalArgv;
    jest.resetModules();
  }
};

const useProjectConfigTestFn = ({
  fileExists = () => false,
  hasPkgProp = () => false,
  tool = '',
  config,
  args = []
}) => {
  const originalArgv = process.argv;

  Object.assign(require('../fileExists'), { fileExists });
  Object.assign(require('../pkg'), { hasPkgProp });

  try {
    process.argv = ['node', 'whichConfig', ...args];

    const { useBuiltinConfig } = require('../whichConfig');

    // tests
    expect(useBuiltinConfig(tool)).toBe(false);
  } catch (error) {
    throw error;
  } finally {
    // afterEach
    process.argv = originalArgv;
    jest.resetModules();
  }
};

cases('whichConfig use built in config', useBuiltinConfigTestFn, useBuiltinConfigTestCases);

cases('whichConfig use project config', useProjectConfigTestFn, useProjectConfigTestCases);
