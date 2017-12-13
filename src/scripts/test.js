process.env.BABEL_ENV = 'test';
process.env.NODE_ENV = 'test';

const { hasPkgProp } = require('../utils/pkg');
const jestConfig = require('../config/jest.config');

const args = process.argv.slice(2);

const watch =
  !args.includes('--no-watch') &&
  !args.includes('--coverage') &&
  !args.includes('--updateSnapshot')
    ? ['--watch']
    : [];

const config =
  !args.includes('--config') && !hasPkgProp('jest')
    ? ['--config', JSON.stringify(jestConfig)]
    : [];

require('jest').run([...config, ...watch, ...args]);
