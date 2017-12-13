#!/usr/bin/env node

if (Number(process.version.slice(1).split('.')[0]) < 8) {
  throw new Error('You must use Node version 8 or greater');
}

require('./run-scripts');
