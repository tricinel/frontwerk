import resolveBin from '../resolveBin';

test('Figure out which is the bin for a given module', () => {
  expect(resolveBin('stylelint')).toEqual('stylelint');
});

test('Throw an error for a bin that does not exist', () => {
  expect(() => resolveBin('shouldntexist')).toThrow();
});
