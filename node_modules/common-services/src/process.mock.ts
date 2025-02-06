import initProcessService from './delay';
import { reuseSpecialProps } from 'knifecycle';

export default reuseSpecialProps(
  initProcessService,
  initProcessMock as unknown as typeof initProcessService,
);

/**
 * Instantiate the process service
 * @name initProcessMock
 * @function
 * @return {Promise<Object>}
 * A promise of the process object
 */
async function initProcessMock(): Promise<void> {
  return undefined;
}
