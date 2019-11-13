import slash from 'slash';

// Remove the quotes around strings
const unquoteSerializer = {
  print: <T>(val: T): T => val,
  test: <T>(val: T): boolean => typeof val === 'string'
};

// Cconvert windows style file paths to unix
const winPathSerializer = {
  print: (val: string): string => slash(val),
  test: <T>(val: T): boolean => typeof val === 'string' && val.includes('\\')
};

export { unquoteSerializer, winPathSerializer };
