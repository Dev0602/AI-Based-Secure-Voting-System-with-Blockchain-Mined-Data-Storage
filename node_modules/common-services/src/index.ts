/* Architecture Note #1: Services

Since the services in this module are very common, we
 provide a helper to require them all with a single
 line of code.

Their goal is to encapsulate unpredictible states and
 inputs/outputs of the software they are part of. They
 are primarily meant to be used with
 [`knifecycle`](https://github.com/nfroidure/knifecycle)
 but should be usable with any DI system or even rawly.
*/

import initCodeGenerator from './codeGenerator';
import initCounter from './counter';
import initDelay from './delay';
import initLock from './lock';
import initLog, { DEFAULT_LOG_ROUTING, DEFAULT_LOG_CONFIG } from './log';
import initTime from './time';
import initRandom from './random';
import initProcess from './process';
import type {
  CodeGeneratorService,
  CodeGeneratorServiceConfig,
} from './codeGenerator';
import type { CounterService, CounterServiceConfig } from './counter';
import type { DelayProvider, DelayService } from './delay';
import type { LockService, LockServiceConfig } from './lock';
import type {
  LogService,
  LogServiceConfig,
  LogTypes,
  LogFunction,
  Logger,
} from './log';
import type { TimeService } from './time';
import type { RandomService } from './random';
import type { ProcessServiceConfig } from './process';

/**
 * All services of the `common-services` module as
 *  properties.
 * @constant
 * @type {Object}
 * @example
 * import * as COMMON_SERVICES from 'common-services';
 * import Knifecycle from 'knifecycle';
 *
 * new Knifecycle().register(
 *   ...Object.keys(COMMON_SERVICES)
 *   .map(serviceName => COMMON_SERVICES[serviceName])
 * );
 */
export type {
  CodeGeneratorServiceConfig,
  CodeGeneratorService,
  CounterServiceConfig,
  CounterService,
  DelayProvider,
  DelayService,
  LockServiceConfig,
  LockService,
  LogService,
  LogServiceConfig,
  LogTypes,
  LogFunction,
  Logger,
  TimeService,
  RandomService,
  ProcessServiceConfig,
};
export {
  initCodeGenerator as initCodeGeneratorService,
  initCounter as initCounterService,
  initDelay as initDelayService,
  initLock as initLockService,
  initLog as initLogService,
  DEFAULT_LOG_CONFIG,
  DEFAULT_LOG_ROUTING,
  initTime as initTimeService,
  initRandom as initRandomService,
  initProcess as initProcessService,
};
