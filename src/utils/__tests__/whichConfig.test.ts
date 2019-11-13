/* eslint-disable global-require */
import cases from 'jest-in-case';

jest.mock('jest');

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
    hasPkgProp: (prop: string): boolean => prop === 'eslintConfig'
  },
  {
    name: 'eslint .eslintrc file exists',
    tool: 'eslint',
    fileExists: (filename: string): boolean => filename === '.eslintrc'
  },
  {
    name: 'eslint .eslintrc.js file exists',
    tool: 'eslint',
    fileExists: (filename: string): boolean => filename === '.eslintrc.js'
  },
  {
    name: 'babel --presets cli arg is passed',
    tool: 'babel',
    args: ['--presets', './custom.js']
  },
  {
    name: 'babel babel pkg prop is used',
    tool: 'babel',
    hasPkgProp: (prop: string): boolean => prop === 'babel'
  },
  {
    name: 'babel .babelrc file exists',
    tool: 'babel',
    fileExists: (filename: string): boolean => filename === '.babelrc'
  },
  {
    name: 'prettier --config cli arg is passed',
    tool: 'prettier',
    args: ['--config', './custom.js']
  },
  {
    name: 'prettier prettierrc pkg prop is used',
    tool: 'prettier',
    hasPkgProp: (prop: string): boolean => prop === 'prettierrc'
  },
  {
    name: 'prettier .prettierrc file exists',
    tool: 'prettier',
    fileExists: (filename: string): boolean => filename === '.prettierrc'
  },
  {
    name: 'prettier prettier.config.js file exists',
    tool: 'prettier',
    fileExists: (filename: string): boolean => filename === 'prettier.config.js'
  },
  {
    name: 'rollup rollup.config.js file exists',
    tool: 'rollup',
    fileExists: (filename: string): boolean => filename === 'rollup.config.js'
  },
  {
    name: 'stylelint --config cli arg is passed',
    tool: 'stylelint',
    args: ['--config', './custom.js']
  },
  {
    name: 'stylelint stylelint pkg prop is used',
    tool: 'stylelint',
    hasPkgProp: (prop: string): boolean => prop === 'stylelint'
  },
  {
    name: 'stylelint .stylelintrc file exists',
    tool: 'stylelint',
    fileExists: (filename: string): boolean => filename === '.stylelintrc'
  },
  {
    name: 'stylelint stylelint.config.js file exists',
    tool: 'stylelint',
    fileExists: (filename: string): boolean =>
      filename === 'stylelint.config.js'
  },
  {
    name: 'jest --config cli arg is passed',
    tool: 'jest',
    args: ['--config', './custom.js']
  },
  {
    name: 'jest jest pkg prop is used',
    tool: 'jest',
    hasPkgProp: (prop: string): boolean => prop === 'jest'
  },
  {
    name: 'jest jest.config.js file exists',
    tool: 'jest',
    fileExists: (filename: string): boolean => filename === 'jest.config.js'
  }
];

const useBuiltinConfigTestFn = ({
  fileExists = () => false,
  hasPkgProp = () => false,
  tool = '',
  args = []
}) => {
  const { argv: originalArgv } = process;

  Object.assign(require('../fileExists'), { fileExists });
  Object.assign(require('../pkg'), { hasPkgProp });

  try {
    process.argv = ['node', 'whichConfig', ...args];

    const { useBuiltinConfig, whichConfig } = require('../whichConfig');
    const msg = 'Using the builtin frontwerk config...';

    // Tests
    expect(useBuiltinConfig(tool)).toBe(true);
    expect(whichConfig(tool)).toEqual(msg);
  } finally {
    // We reset everything afterEach
    process.argv = originalArgv;
    jest.resetModules();
  }
};

const useProjectConfigTestFn = ({
  fileExists = () => false,
  hasPkgProp = () => false,
  tool = '',
  args = []
}) => {
  const { argv: originalArgv } = process;

  Object.assign(require('../fileExists'), { fileExists });
  Object.assign(require('../pkg'), { hasPkgProp });

  try {
    process.argv = ['node', 'whichConfig', ...args];

    const { useBuiltinConfig, whichConfig } = require('../whichConfig');
    const msg = whichConfig(tool);

    // Tests
    expect(useBuiltinConfig(tool)).toBe(false);
    expect(whichConfig(tool)).toEqual(msg);
  } finally {
    // We reset everything afterEach
    process.argv = originalArgv;
    jest.resetModules();
  }
};

cases(
  'whichConfig use built in config',
  useBuiltinConfigTestFn,
  useBuiltinConfigTestCases
);

cases(
  'whichConfig use project config',
  useProjectConfigTestFn,
  useProjectConfigTestCases
);
