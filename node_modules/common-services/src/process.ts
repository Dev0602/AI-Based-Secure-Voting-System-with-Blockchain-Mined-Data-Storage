import YError from 'yerror';
import { autoProvider, singleton } from 'knifecycle';
import type { FatalErrorService, Knifecycle } from 'knifecycle';
import type { LogService } from './log';

const DEFAULT_NODE_ENVS = ['development', 'test', 'production'];
const DEFAULT_SIGNALS: NodeJS.Signals[] = ['SIGTERM', 'SIGINT'];

function noop(): void {
  return undefined;
}

export type ProcessServiceConfig = {
  NODE_ENV?: string;
  PROCESS_NAME?: string;
  SIGNALS?: NodeJS.Signals[];
  NODE_ENVS?: string[];
};
export type ProcessServiceDependencies = ProcessServiceConfig & {
  NODE_ENV: string;
  exit: typeof process.exit;
  $instance: Knifecycle;
  $fatalError: FatalErrorService;
  log?: LogService;
};

/* Architecture Note #1.5: Process
The `process` service takes care of the process status.

It returns nothing and should be injected only for its
 side effects.
*/

export default singleton(autoProvider(initProcess));

/**
 * Instantiate the process service
 * @name initProcess
 * @function
 * @param  {Object}   services
 * The services to inject
 * @return {Promise<Object>}
 * A promise of the process object
 */
async function initProcess({
  NODE_ENV,
  PROCESS_NAME = '',
  SIGNALS = DEFAULT_SIGNALS,
  NODE_ENVS = DEFAULT_NODE_ENVS,
  log = noop,
  exit,
  $instance,
  $fatalError,
}: ProcessServiceDependencies): Promise<{
  service: NodeJS.Process;
  dispose: () => Promise<void>;
}> {
  const signalsListeners = SIGNALS.map<
    [NodeJS.Signals, NodeJS.SignalsListener]
  >((signal) => [signal, terminate.bind(null, signal)]);
  let shuttingDown = false;

  /* Architecture Note #1.5.1: Node environment filtering

  It also forces NODE_ENV to be set to avoid unintentionnal
   development version shipping to production. You can specify
   your own list of valid environments by injecting the
   `SIGNALS` optional dependency.
  */
  if (!NODE_ENVS.includes(NODE_ENV)) {
    throw new YError('E_NODE_ENV', NODE_ENV);
  }

  log('warning', `🔂 - Running in "${NODE_ENV}" environment.`);

  global.process.title =
    (PROCESS_NAME || global.process.title) + ' - ' + NODE_ENV;

  /* Architecture Note #1.5.2: Signals handling

  It also handle SIGINT and SIGTERM signals to allow to
   gracefully shutdown the running process. The signals
   to handle can be customized by injecting the `SIGNALS`
   optional dependencies.
  */
  signalsListeners.forEach(([signal, signalListener]) => {
    global.process.on(signal, signalListener);
  });

  /* Architecture Note #1.5.3: Handling services fatal errors

  If an error occurs it attempts to gracefully exit
  to give it a chance to finish properly.
  */
  $fatalError.promise.catch((err) => {
    log('error', '💀 - Fatal error');
    log('error-stack', err.stack || err);
    terminate('FATAL');
  });

  /* Architecture Note #1.5.4: Uncaught exceptions

  If an uncaught exeption occurs it also attempts to
   gracefully exit since a process should never be kept
   alive when an uncaught exception is raised.
  */
  global.process.on('uncaughtException', catchUncaughtException);

  function catchUncaughtException(err: Error) {
    log('error', '💀 - Uncaught Exception');
    log(
      'error-stack',
      (err as Error).stack ||
        // Catching anything that could be inside err
        // since some people have the nice idea to
        // throw undefined or just a string.
        '' + (err as unknown as string),
    );
    terminate('ERR');
  }

  function terminate(signal: NodeJS.Signals | 'ERR' | 'FATAL') {
    if (shuttingDown) {
      log('warning', `🚦 - ${signal} received again, shutdown now.`);
      exit(1);
    } else {
      log(
        'warning',
        `🚦 - ${signal} received. Send it again to kill me instantly.`,
      );
      shutdown(['ERR', 'FATAL'].includes(signal) ? 1 : 0);
    }
  }

  async function shutdown(code: number) {
    shuttingDown = true;
    log('warning', 'Shutting down now 🙏...');
    await $instance.destroy();

    try {
      log('warning', '😎 - Gracefull shutdown sucessfully done !');
      exit(code);
    } catch (err) {
      log('error', '🤔 - Could not gracefully shutdown.');
      log(
        'error-stack',
        (err as Error).stack ||
          // Catching anything that could be inside err
          // since some people have the nice idea to
          // throw undefined or just a string.
          '' + (err as unknown as string),
      );
      exit(code);
    }
  }

  async function dispose() {
    global.process.removeListener('uncaughtException', catchUncaughtException);
    signalsListeners.forEach(([signal, signalListener]) => {
      global.process.removeListener(signal, signalListener);
    });
  }

  log('debug', '📇 - Process service initialized.');
  return {
    service: global.process,
    dispose,
  };
}
