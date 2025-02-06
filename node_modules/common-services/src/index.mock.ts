import initLogMock from './log.mock';
import initTimeMock from './time.mock';
import initRandomMock from './random.mock';
import initDelayMock from './delay.mock';
import initProcessMock from './process.mock';

/**
 * All mocks of the `common-services` module as
 *  properties.
 * @constant
 * @type {Object}
 * @example
 * import * as COMMON_MOCKS from 'common-services';
 * import $ from 'knifecycle/instance';
 *
 * $.register(
 *   ...Object.keys(COMMON_MOCKS)
 *   .map(serviceName => COMMON_MOCKS[serviceName])
 *  );
 */

export {
  initLogMock,
  initTimeMock,
  initRandomMock,
  initDelayMock,
  initProcessMock,
};
