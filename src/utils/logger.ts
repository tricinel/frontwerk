/* eslint @typescript-eslint/unbound-method: "off" */

import consola from 'consola';
import { compose, join } from 'ramda';

const argsToArray = (...args: string[]): string[] => [...args];
const formatMessage: (...args: string[]) => string = compose(
  join('\n'),
  argsToArray
);

const success: (...args: string[]) => void = compose(
  consola.success,
  formatMessage
);
const error: (...args: string[]) => void = compose(
  consola.error,
  formatMessage
);
const warning: (...args: string[]) => void = compose(
  consola.warn,
  formatMessage
);
const info: (...args: string[]) => void = compose(
  consola.info,
  formatMessage
);
const start: (...args: string[]) => void = compose(
  consola.start,
  formatMessage
);

export { formatMessage, success, error, warning, info, start };
