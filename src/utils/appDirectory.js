const path = require('path');

const { pkgPath } = require('./pkg');

const appDirectory = path.dirname(pkgPath);

module.exports = { appDirectory };
