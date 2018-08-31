const defaultConfigs = {
  eslint: {
    filename: '.eslintrc.js',
    additionalFilenames: ['.eslintrc'],
    pkgProp: 'eslintConfig'
  },
  eslintIgnore: {
    filename: '.eslintignore',
    additionalFilenames: [],
    pkgProp: 'eslintIgnore'
  },
  jest: {
    filename: 'jest.config.js',
    additionalFilenames: [],
    pkgProp: 'jest'
  },
  prettier: {
    filename: 'prettier.config.js',
    additionalFilenames: ['.prettierrc'],
    pkgProp: ''
  },
  prettierIgnore: {
    filename: '.prettierignore',
    additionalFilenames: [],
    pkgProp: ''
  },
  stylelint: {
    filename: 'stylelint.config.js',
    additionalFilenames: ['.stylelintrc'],
    pkgProp: ''
  },
  stylelintIgnore: {
    filename: '.stylelintignore',
    additionalFilenames: [],
    pkgProp: ''
  }
};

module.exports = { defaultConfigs };
