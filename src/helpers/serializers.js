import slash from 'slash';

// this removes the quotes around strings...
const unquoteSerializer = {
  print: val => val,
  test: val => typeof val === 'string'
};

// this converts windows style file paths to unix...
const winPathSerializer = {
  print: val => slash(val),
  test: val => typeof val === 'string' && val.includes('\\')
};

module.exports = { unquoteSerializer, winPathSerializer };
