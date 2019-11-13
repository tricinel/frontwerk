import { start } from '../utils/logger';
import { whichConfig } from '../utils/whichConfig';

start(whichConfig());

const result = { status: 1 };

process.exit(result.status);
