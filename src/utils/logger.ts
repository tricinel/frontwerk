/* eslint @typescript-eslint/unbound-method: "off" */

import consola from 'consola';
import { compose, join } from 'ramda';

const argsToArray = (...args: string[]): string[] => [...args];
const formatMessage = compose(
  join('\n'),
  argsToArray
);

const success = compose(
  consola.success,
  formatMessage
);
const error = compose(
  consola.error,
  formatMessage
);
const warning = compose(
  consola.warn,
  formatMessage
);
const info = compose(
  consola.info,
  formatMessage
);
const start = compose(
  consola.start,
  formatMessage
);

export { formatMessage, success, error, warning, info, start };
