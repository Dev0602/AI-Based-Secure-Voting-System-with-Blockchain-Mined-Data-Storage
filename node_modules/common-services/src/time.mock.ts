import sinon from 'sinon';
import initTimeService from './time';
import { reuseSpecialProps } from 'knifecycle';
import type { TimeService } from './time';

/* Architecture Note #1.2.1: Mocking time

The time mock uses the [`sinon`](https://github.com/sinonjs/sinon/)
 module under the hood like for the logging mock.
*/

export default reuseSpecialProps(
  initTimeService,
  initTimeMock as typeof initTimeService,
);

/**
 * Instantiate the time service mock
 * @name initTimeMock
 * @function
 * @return {Promise<Function>}  A promise of the mocked
 *  time function
 * @example
 * import initTimeMock from 'common-services/dist/time.mock';
 * import assert from 'assert';
 *
 * const time = await initTimeMock();
 *
 * // Let's returns Thomas birth date (OMG ya father
 * // talking me about its childrens :D).
 * time.returns(new Date('2014-01-26T00:00:00.000Z'));
 *
 * assert.equal(time(), 1390694400000);
 * assert.deepEqual(time.args, [[]], 'Called once');
 *
 * time.reset();
 *
 * assert.deepEqual(time.args, []);
 */
async function initTimeMock(): Promise<TimeService> {
  return sinon.stub();
}
