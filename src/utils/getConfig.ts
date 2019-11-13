import path from 'path';

const getConfig = (dirPath: string): string =>
  path.join(__dirname, '../config', dirPath).replace(process.cwd(), '.');

export default getConfig;
