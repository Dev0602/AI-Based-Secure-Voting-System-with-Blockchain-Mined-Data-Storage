import Knifecycle, { constant } from 'knifecycle';
import initLogService from './log';
import type { LogService } from '.';

describe('initLogService', () => {
  const logger = { output: jest.fn(), error: jest.fn(), debug: jest.fn() };

  beforeEach(() => {
    logger.output.mockReset();
    logger.error.mockReset();
    logger.debug.mockReset();
  });

  test('should work', (done) => {
    initLogService({
      logger,
    })
      .then((fn) => {
        expect('function' === typeof fn);
        expect(logger.debug.mock.calls).toMatchInlineSnapshot(`
          Array [
            Array [
              "👣 - Logging service initialized.",
            ],
          ]
        `);
        expect(logger.output.mock.calls).toMatchInlineSnapshot(`Array []`);
        expect(logger.error.mock.calls).toMatchInlineSnapshot(`Array []`);
      })
      .then(() => done())
      .catch(done);
  });

  describe('log', () => {
    test('should work', (done) => {
      initLogService({
        logger,
      })
        .then((log) => {
          logger.debug.mockClear();
          log('debug', 'debug test');
          log('debug-stack', 'debug stack test');
          log('info', 'info test');
          log('error', 'error test');
          log('error-stack', 'error stack test');
          log('warning', 'warning test');
          expect(logger.debug.mock.calls).toMatchInlineSnapshot(`
            Array [
              Array [
                "debug test",
              ],
              Array [
                "debug stack test",
              ],
            ]
          `);
          expect(logger.output.mock.calls).toMatchInlineSnapshot(`
            Array [
              Array [
                "info test",
              ],
            ]
          `);
          expect(logger.error.mock.calls).toMatchInlineSnapshot(`
            Array [
              Array [
                "error test",
              ],
              Array [
                "error stack test",
              ],
              Array [
                "warning test",
              ],
            ]
          `);
        })
        .then(() => done())
        .catch(done);
    });
  });

  test('should work with Knifecycle', (done) => {
    new Knifecycle()
      .register(initLogService)
      .register(constant('logger', logger))
      .run<{ log: LogService }>(['log'])
      .then(({ log }) => {
        logger.debug.mockClear();
        log('debug', 'debug test');
        log('info', 'info test');
        expect(logger.debug.mock.calls).toMatchInlineSnapshot(`
          Array [
            Array [
              "debug test",
            ],
          ]
        `);
        expect(logger.output.mock.calls).toMatchInlineSnapshot(`
          Array [
            Array [
              "info test",
            ],
          ]
        `);
        expect(logger.error.mock.calls).toMatchInlineSnapshot(`Array []`);
      })
      .then(() => done())
      .catch(done);
  });
});
