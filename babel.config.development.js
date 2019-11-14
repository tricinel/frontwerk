module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: 'cjs',
        targets: {
          node: true
        }
      }
    ],
    '@babel/preset-typescript'
  ],
  plugins: [
    ['@babel/plugin-transform-runtime', { useESModules: false }],
    'babel-plugin-minify-dead-code-elimination'
  ],
  ignore: [
    'src/**/__mocks__/*.ts',
    'src/**/__tests__/*.test.ts',
    'src/@types/*.d.ts'
  ]
};
