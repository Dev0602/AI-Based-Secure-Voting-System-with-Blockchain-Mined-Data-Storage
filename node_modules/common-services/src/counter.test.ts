import Knifecycle, { constant } from 'knifecycle';
import initCounterService from './counter';

describe('initCounterService', () => {
  const log = jest.fn();

  beforeEach(() => {
    log.mockReset();
  });

  test('should work', async () => {
    const counter = await initCounterService({
      log,
    });

    expect('function' === typeof counter);
    expect(log.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          "debug",
          "📇 - Counter service initialized.",
        ],
      ]
    `);
  });

  describe('counter', () => {
    test('should work', async () => {
      const counter = await initCounterService({
        log,
      });

      log.mockReset();

      const num = await counter();

      expect(log.mock.calls).toEqual([['debug', '📇 - Picked a count:', num]]);
    });
  });

  test('should work with Knifecycle', async () => {
    const { counter } = await new Knifecycle()
      .register(initCounterService)
      .register(constant('log', log))
      .run(['counter']);

    expect(counter).toBeDefined();
    expect(log.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          "debug",
          "📇 - Counter service initialized.",
        ],
      ]
    `);
  });
});
