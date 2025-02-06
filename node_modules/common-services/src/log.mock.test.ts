import assert from 'assert';
import initLogMock from './log.mock';
import type { LogServiceDependencies } from './log';

describe('initLogMock', () => {
  test('should work', (done) => {
    initLogMock({} as LogServiceDependencies)
      .then((fn) => assert('function' === typeof fn))
      .then(() => done())
      .catch(done);
  });
});
