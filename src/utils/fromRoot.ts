import path from 'path';

import appDirectory from './appDirectory';

const fromRoot = (...paths: string[]): string =>
  path.join(appDirectory, ...paths);

export default fromRoot;
