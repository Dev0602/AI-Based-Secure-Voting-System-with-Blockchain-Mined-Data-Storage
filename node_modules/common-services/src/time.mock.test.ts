import assert from 'assert';
import initTimeMock from './time.mock';

describe('initTimeMock', () => {
  test('should work', (done) => {
    initTimeMock({})
      .then((fn) => assert('function' === typeof fn))
      .then(() => done())
      .catch(done);
  });
});
