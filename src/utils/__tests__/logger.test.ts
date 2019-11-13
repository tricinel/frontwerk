import { formatMessage } from '../logger';

test('Create the correct message', () => {
  const messages = [
    'Message title!',
    'Message body goes here.',
    'Some other message on another line.'
  ];

  expect(formatMessage(...messages)).toMatchSnapshot();
});
