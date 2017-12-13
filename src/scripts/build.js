/* eslint-disable global-require */
if (process.argv.includes('--bundle')) {
  require('./rollup');
} else if (process.argv.includes('--pack')) {
  require('./webpack');
} else {
  require('./babel');
}
