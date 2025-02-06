import YError from 'yerror';
import initDelayService from './delay';
import { reuseSpecialProps } from 'knifecycle';

/* Architecture Note #1.4.1: Mocking delays

This mock is largely inspired by the `$timeout` one of
 AngularJS. It allows to resolve/reject pending delays
 for testing. That said, it does it asynchronously
 where the former one was synchronous. This is not a
 bug but a design choice to keep the closest possible
 to what would happen in actual code.
*/

export default reuseSpecialProps(
  initDelayService as unknown as typeof initDelayMock,
  initDelayMock,
);

/**
 * Instantiate the delay service mock
 * @name initDelayMock
 * @function
 * @return {Promise<Object>}
 * A promise of the mocked delay service
 * @example
 * import initDelayMock from 'common-services/dist/delay.mock';
 * import assert from 'assert';
 *
 * const delay = await initDelayMock();
 *
 * const delayPromise = delay.create(1000);
 *
 * delay.resolve(delayPromise);
 *
 * delayPromise.then(() => {
 *   // Any code here will execute immediatly
 *   // instead of after a 1000ms delay
 * });
 */
function initDelayMock(_: unknown): Promise<{
  service: {
    create: (delay: number) => Promise<void>;
    clear: (promise: Promise<void>) => Promise<void>;
    __resolve: (promise: Promise<void>) => Promise<void>;
    __resolveAll: () => Promise<void>;
    __reject: (promise: Promise<void>) => Promise<void>;
    __rejectAll: () => Promise<void>;
  };
}> {
  const pendingPromises: {
    promise: Promise<void>;
    resolve: Parameters<ConstructorParameters<typeof Promise>[0]>[0];
    reject: Parameters<ConstructorParameters<typeof Promise>[0]>[1];
  }[] = [];

  return Promise.resolve({
    service: {
      create,
      clear,
      __resolve,
      __resolveAll,
      __reject,
      __rejectAll,
    },
  });

  function create(_: number): Promise<void> {
    let _resolve;
    let _reject;
    const promise = new Promise<void>((resolve, reject) => {
      _reject = reject;
      _resolve = resolve;
    });

    pendingPromises.push({
      promise,
      resolve: _resolve,
      reject: _reject,
    });
    return promise as Promise<void>;
  }

  async function clear(promise: Promise<void>) {
    const pendingPromiseIndex = pendingPromises.findIndex(
      (pendingPromise) => pendingPromise.promise === promise,
    );

    if (-1 === pendingPromiseIndex) {
      return Promise.reject(new YError('E_BAD_DELAY'));
    }
    pendingPromises[pendingPromiseIndex].reject(new YError('E_DELAY_CLEARED'));
    pendingPromises.splice(pendingPromiseIndex, 1);
    return Promise.resolve() as Promise<void>;
  }

  function __resolve(promise: Promise<void>) {
    const pendingPromise = pendingPromises.find(
      (pendingPromise) => pendingPromise.promise === promise,
    );

    if (!pendingPromise) {
      return Promise.reject(new YError('E_BAD_DELAY'));
    }
    pendingPromise.resolve(undefined);
    return Promise.resolve().then(__delete.bind(null, promise));
  }

  async function __resolveAll() {
    await Promise.all(pendingPromises.map(({ promise }) => __resolve(promise)));
  }

  function __reject(promise) {
    const pendingPromise = pendingPromises.find(
      (pendingPromise) => pendingPromise.promise === promise,
    );

    if (!pendingPromise) {
      return Promise.reject(new YError('E_BAD_DELAY'));
    }
    pendingPromise.reject(new YError('E_DELAY_CLEARED'));
    return Promise.resolve().then(__delete.bind(null, promise));
  }

  async function __rejectAll() {
    await Promise.all(pendingPromises.map(({ promise }) => __reject(promise)));
  }

  function __delete(promise: Promise<void>) {
    const pendingPromiseIndex = pendingPromises.findIndex(
      (pendingPromise) => pendingPromise.promise === promise,
    );
    pendingPromises.splice(pendingPromiseIndex, 1);
  }
}
