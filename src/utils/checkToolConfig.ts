export type Tools =
  | 'eslint'
  | 'babel'
  | 'prettier'
  | 'stylelint'
  | 'jest'
  | 'rollup';

type ToolsConfig<T> = { [tool in Tools]: T };

const files: ToolsConfig<string[]> = {
  eslint: ['.eslintrc', '.eslintrc.js'],
  babel: ['.babelrc'],
  prettier: ['.prettierrc', 'prettier.config.js'],
  rollup: ['rollup.config.js'],
  stylelint: ['.stylelintrc', 'stylelint.config.js'],
  jest: ['jest.config.js']
};

const pkgProps: Partial<ToolsConfig<string>> = {
  eslint: 'eslintConfig',
  babel: 'babel',
  prettier: 'prettierrc',
  stylelint: 'stylelint',
  jest: 'jest'
};

const cliArgs: Partial<ToolsConfig<string>> = {
  eslint: 'config',
  babel: 'presets',
  prettier: 'config',
  stylelint: 'config',
  jest: 'config'
};

export { files, pkgProps, cliArgs };
