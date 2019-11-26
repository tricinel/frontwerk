/* eslint-disable global-require,@typescript-eslint/no-require-imports */
if (process.argv.includes('--bundle')) {
  require('./rollup');
} else {
  require('./babel');
}
