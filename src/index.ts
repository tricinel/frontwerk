#!/usr/bin/env node

if (Number(process.version.slice(1).split('.')[0]) < 10) {
  throw new Error('You must use Node version 10 or greater');
}

require('./run-scripts');
