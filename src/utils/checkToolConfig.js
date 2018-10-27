const files = {
  eslint: ['.eslintrc', '.eslintrc.js'],
  tslint: ['tslint.json', 'tslint.yaml', 'tslint.yml'],
  babel: ['.babelrc'],
  prettier: ['.prettierrc', 'prettier.config.js'],
  rollup: ['rollup.config.js'],
  stylelint: ['.stylelintrc', 'stylelint.config.js'],
  jest: ['jest.config.js'],
  webpack: ['webpack.config.js']
};

const pkgProps = {
  eslint: 'eslintConfig',
  tslint: 'tslint',
  babel: 'babel',
  prettier: 'prettierrc',
  stylelint: 'stylelint',
  jest: 'jest'
};

const cliArgs = {
  eslint: 'config',
  tslint: 'config',
  babel: 'presets',
  prettier: 'config',
  stylelint: 'config',
  jest: 'config',
  webpack: 'config'
};

module.exports = { files, pkgProps, cliArgs };
