import {
  compose,
  join,
  lensIndex,
  map,
  over,
  replace,
  split,
  toLower,
  toUpper,
  trim
} from 'ramda';

const overFirst = over(lensIndex(0));
const capitalize = compose(
  join(''),
  overFirst(toUpper)
);
const uncapitalize = compose(
  join(''),
  overFirst(toLower)
);

const normalize = replace(/[^a-zA-Z0-9.]+/g, ' ');

const toCamelCase = compose(
  uncapitalize,
  join(''),
  map(capitalize),
  split(' '),
  trim,
  normalize,
  toLower
);

export { uncapitalize, capitalize, toCamelCase };
