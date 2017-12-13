const {
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
} = require('ramda');

const overFirst = over(lensIndex(0));
const capitalize = compose(join(''), overFirst(toUpper));
const uncapitalize = compose(join(''), overFirst(toLower));

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

module.exports = { uncapitalize, capitalize, toCamelCase };
