const config = {
  plugins: ['stylelint-a11y', 'stylelint-high-performance-animation'],
  extends: [
    'stylelint-config-standard',
    'stylelint-a11y/recommended',
    'stylelint-prettier/recommended'
  ],
  rules: {
    'plugin/no-low-performance-animation-properties': [
      true,
      {
        ignoreProperties: ['border-color']
      }
    ]
  }
};

export default config;
module.exports = config;
