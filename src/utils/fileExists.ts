import fs from 'fs';
import path from 'path';

import appDirectory from './appDirectory';

const fileExists = (...paths: string[]): boolean =>
  fs.existsSync(path.join(appDirectory, ...paths));

export default fileExists;
