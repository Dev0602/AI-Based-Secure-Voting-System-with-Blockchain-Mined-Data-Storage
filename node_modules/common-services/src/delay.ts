import YError from 'yerror';
import { autoProvider, singleton } from 'knifecycle';
import type { LogService } from './log';

function noop(): void {
  return undefined;
}

export interface DelayProvider {
  service: DelayService;
  dispose: () => Promise<void>;
}
export interface DelayService {
  create: (delay: number) => Promise<void>;
  clear: (promise: Promise<void>) => Promise<void>;
}

/* Architecture Note #1.4: Delaying

The delay service is `setTimeout` like I would like it
 to be.
*/

export default singleton(autoProvider(initDelay));

/**
 * Instantiate the delay service
 * @name initDelay
 * @function
 * @param  {Object}     services
 * The services to inject
 * @param  {Function}   [services.log=noop]
 * A logging function
 * @return {Promise<Object>}
 * A promise of the delay service
 * @example
 * import initDelay from 'common-services/dist/delay';
 *
 * const delay = await initDelay({
 *   log: console.log.bind(console)
 * });
 */
async function initDelay({
  log = noop,
}: {
  log?: LogService;
}): Promise<DelayProvider> {
  const pendingPromises = new Map();

  log('debug', '⌛ - Delay service initialized.');

  return {
    service: {
      create,
      clear,
    },
    dispose,
  };

  /**
   * Create a new delay
   * @param  {Number}   delay  The delay in ms
   * @return {Promise}
   * A promise to be resolved after that delay
   * or rejected if it is cancelled.
   * @example
   * await delay.create(1000);
   * console.log('1000 ms elapsed!');
   */
  function create(delay: number): Promise<void> {
    let timeoutId;
    let _reject;
    const promise: Promise<void> = new Promise((resolve, reject) => {
      _reject = reject;
      timeoutId = setTimeout(() => {
        resolve();
        pendingPromises.delete(promise);
      }, delay);
    });

    pendingPromises.set(promise, {
      timeoutId,
      reject: _reject,
    });
    log('debug', '⏳ - Created a delay:', delay);
    return promise;
  }

  /**
   * Cancel an earlier created delay
   * @param  {Promise}   promise
   * The promise of the delay to cancel
   * @return {Promise}
   * A promise resolved when cancellation is done.
   * @example
   * try {
   *   const delayPromise = delay.create(1000);
   *   await Promise.all(delayPromise, delay.clear(delayPromise));
   *   console.log('1000 ms elapsed!');
   * } catch (err) {
   *   if(err.code != 'E_DELAY_CLEARED') {
   *     trow err;
   *   }
   *   console.log('Cancelled!'));
   * }
   * // Prints: Cancelled!
   */
  async function clear(promise) {
    if (!pendingPromises.has(promise)) {
      return Promise.reject(new YError('E_BAD_DELAY'));
    }
    const { timeoutId, reject } = pendingPromises.get(promise);

    clearTimeout(timeoutId);
    reject(new YError('E_DELAY_CLEARED'));
    pendingPromises.delete(promise);
    log('debug', '⏳ - Cleared a delay');
  }

  async function dispose(): Promise<void> {
    await new Promise((resolve) => {
      log('debug', '⏳ - Cancelling pending timeouts:', pendingPromises.size);
      resolve(Promise.all([...pendingPromises.keys()].map(clear)));
    });
  }
}
