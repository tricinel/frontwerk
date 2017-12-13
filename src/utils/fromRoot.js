const path = require('path');

const { appDirectory } = require('./appDirectory');

const fromRoot = (...paths) => path.join(appDirectory, ...paths);

module.exports = { fromRoot };
