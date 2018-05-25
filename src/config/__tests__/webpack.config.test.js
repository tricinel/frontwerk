import {
  unquoteSerializer,
  winPathSerializer
} from '../../helpers/serializers';

const jestSerializerPath = require('jest-serializer-path');
const getWebpackConfig = require('../webpack.config');

expect.addSnapshotSerializer(unquoteSerializer);
expect.addSnapshotSerializer(winPathSerializer);
expect.addSnapshotSerializer(jestSerializerPath);

test('Gets the webpack config for production', () => {
  expect(getWebpackConfig('production')).toMatchSnapshot();
});
