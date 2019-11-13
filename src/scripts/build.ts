/* eslint-disable global-require,@typescript-eslint/no-require-imports */
if (process.argv.includes('--bundle')) {
  require('./rollup');
} else if (process.argv.includes('--pack')) {
  require('./parcel');
} else {
  require('./babel');
}
