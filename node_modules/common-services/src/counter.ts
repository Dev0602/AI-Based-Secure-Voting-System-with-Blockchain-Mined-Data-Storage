import { autoService, singleton } from 'knifecycle';
import type { LogService } from './log';

function noop(): void {
  return undefined;
}

export interface CounterService {
  (): Promise<number>;
}

export type CounterServiceConfig = {
  COUNTER?: { firstCount: number };
};
export type CounterServiceDependencies = CounterServiceConfig & {
  log?: LogService;
};

const DEFAULT_COUNTER = {
  firstCount: 1,
};

/* Architecture Note #1.6: Counter

The `counter` service provide a simple, local and
 stubbable counter.

The count are returned asynchronously in order
 to be easily maintained across several instances
 if needed later via another service with the same
 surface API.
*/

export default singleton(autoService(initCounter), true);

/**
 * Instantiate the counter service
 * @name initCounter
 * @function
 * @param  {Object}   services
 * The services to inject
 * @param  {Object}   [services.COUNTER=DEFAULT_COUNTER]
 * An optional configuration object
 * @param  {Object}   [services.log=noop]
 * An optional logging function
 * @return {Promise<Function>}
 * A promise of the counter function
 * @example
 * import initCounter from 'common-services/dist/counter';
 *
 * const counter = await initCounter({
 *   COUNTER: { firstCount: 1 },
 *   log: console.log.bind(console),
 * });
 */
async function initCounter({
  COUNTER = DEFAULT_COUNTER,
  log = noop,
}: CounterServiceDependencies): Promise<CounterService> {
  let currentCount = COUNTER.firstCount;

  log('debug', '📇 - Counter service initialized.');

  return counter;

  /**
   * Returns the current count and increment the counter
   * @return {Promise<number>}
   * A promise of the current count
   * @example
   * console.log([
   *   counter(),
   *   counter(),
   *   counter(),
   * ]);
   * // Prints: 1,2,3
   */
  async function counter() {
    log('debug', '📇 - Picked a count:', currentCount);
    return currentCount++;
  }
}
