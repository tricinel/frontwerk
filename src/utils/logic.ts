import { equals, all, any } from 'ramda';

const isTrue = equals(true);
const isFalse = equals(false);

const allTrue = all(isTrue);
const anyTrue = any(isTrue);
const allFalse = all(isFalse);

export { isTrue, isFalse, anyTrue, allTrue, allFalse };
