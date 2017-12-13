const { resolveBin } = require('../resolveBin');

test('Figure out which is the bin for a given module', () => {
  expect(resolveBin('webpack')).toEqual('webpack');
});

test('Figure out which is the bin for a given module and executable', () => {
  expect(resolveBin('flow-bin', { executable: 'flow' })).toEqual('flow');
});

test('Throw an error for a bin that does not exist', () => {
  expect(() => resolveBin('shouldntexist')).toThrow();
});
