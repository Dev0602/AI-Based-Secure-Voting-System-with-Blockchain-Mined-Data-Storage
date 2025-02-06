import { autoService, singleton } from 'knifecycle';
import type { LogService } from './log';

function noop(): void {
  return undefined;
}

export interface RandomService {
  (): number;
}

/* Architecture Note #1.3: Randomness

The random service is just proxying [`Math.random`
](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Math/random)
 in a stubbable manner.
*/

export default singleton(autoService(initRandom));

/**
 * Instantiate the random service
 * @name initRandom
 * @function
 * @param  {Object}   services           The services to inject
 * @param  {Object}   [services.log = noop]     A logging function
 * @return {Promise<Function>}           A promise of the random function
 * @example
 * import initRandom from 'common-services/dist/random';
 *
 * const random = await initRandom({
 *   log: console.log.bind(console),
 * });
 */
async function initRandom({
  log = noop,
}: {
  log?: LogService;
}): Promise<RandomService> {
  log('debug', '🎲 - Random service initialized.');

  return random;

  /**
   * Returns a new random number
   * @return {number}   The random number
   * @example
   * random()
   * // Prints: 0.3141592653589793
   */
  function random(): number {
    const num = Math.random();

    log('debug', '🎲 - Created a random number:', num);

    return num;
  }
}
