const rimrafMock = jest.fn();
rimrafMock.sync = jest.fn();

module.exports = rimrafMock;
