import { autoService, singleton } from 'knifecycle';
import type { LogService } from './log';

function noop(): void {
  return undefined;
}

export interface TimeService {
  (): number;
}

/* Architecture Note #1.2: Time

The time service is just proxying [`Date.now`
](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date/now)
 in a stubbable manner.
*/

export default singleton(autoService(initTime));

/**
 * Instantiate the time service
 * @name initTime
 * @function
 * @param  {Object}   services           The services to inject
 * @param  {Object}   [services.log = noop]     A logging function
 * @return {Promise<Function>}           A promise of the time function
 * @example
 * import initTime from 'common-services/dist/time';
 *
 * const time = await initTime({
 *   log: console.log.bind(console),
 * });
 */
async function initTime({
  log = noop,
}: {
  log?: LogService;
}): Promise<TimeService> {
  log('debug', '⏰ - Time service initialized.');

  return time;

  /**
   * Returns the current timestamp
   * @return {number}   The current timestamp
   * @example
   * time()
   * // Prints: 1326585600000
   */
  function time() {
    const now = Date.now();

    log('debug', '⏰ - Picked a timestamp:', now);
    return now;
  }
}
