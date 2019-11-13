import getConfig from '../getConfig';

test('Get the configuration file from the config folder', () => {
  expect(getConfig('config.js')).toEqual('./src/config/config.js');
});
