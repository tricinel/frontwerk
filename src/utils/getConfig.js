const path = require('path');

const getConfig = p =>
  path.join(__dirname, '../config', p).replace(process.cwd(), '.');

module.exports = { getConfig };
