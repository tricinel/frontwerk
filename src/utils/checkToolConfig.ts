export type Tools =
  | 'eslint'
  | 'babel'
  | 'prettier'
  | 'stylelint'
  | 'jest'
  | 'rollup';

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>; // eslint-disable-line @typescript-eslint/no-type-alias
type ToolsConfig<T> = { [tool in Tools]: T };

const files: ToolsConfig<string[]> = {
  eslint: ['.eslintrc', '.eslintrc.js'],
  babel: ['.babelrc'],
  prettier: ['.prettierrc', 'prettier.config.js'],
  rollup: ['rollup.config.js'],
  stylelint: ['.stylelintrc', 'stylelint.config.js'],
  jest: ['jest.config.js']
};

const pkgProps: Omit<ToolsConfig<string>, 'rollup'> = {
  eslint: 'eslintConfig',
  babel: 'babel',
  prettier: 'prettierrc',
  stylelint: 'stylelint',
  jest: 'jest'
};

const cliArgs: ToolsConfig<string> = {
  eslint: 'config',
  babel: 'presets',
  prettier: 'config',
  stylelint: 'config',
  jest: 'config',
  rollup: 'config'
};

export { files, pkgProps, cliArgs };
