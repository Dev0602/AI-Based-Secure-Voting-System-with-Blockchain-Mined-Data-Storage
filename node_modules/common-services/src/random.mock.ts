import sinon from 'sinon';
import initRandomService from './random';
import { reuseSpecialProps } from 'knifecycle';

/* Architecture Note #1.3.1: Mocking randomness

The random mock uses the [`sinon`](https://github.com/sinonjs/sinon/)
 module under the hood like for the logging mock.
*/

export default reuseSpecialProps(
  initRandomService,
  initRandomMock as typeof initRandomService,
);

/**
 * Instantiate the random service mock
 * @name initRandomMock
 * @function
 * @return {Promise<Function>}  A promise of the mocked
 *  random function
 * @example
 * import initRandomMock from 'common-services/dist/random.mock';
 * import assert from 'assert';
 *
 * const random = await initRandomMock();
 *
 * random.returns(0.5); // A good limit value to test ;)
 *
 * assert.equal(random(), 0.5);
 * assert.deepEqual(random.args, [[]], 'Called once');
 *
 * random.reset();
 *
 * assert.deepEqual(random.args, []);
 */
async function initRandomMock() {
  return sinon.stub();
}
