const fs = require('fs');
const path = require('path');

const { appDirectory } = require('./appDirectory');

const fileExists = (...paths) =>
  fs.existsSync(path.join(appDirectory, ...paths));

module.exports = { fileExists };
