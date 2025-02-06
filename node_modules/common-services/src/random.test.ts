import Knifecycle, { constant } from 'knifecycle';
import initRandomService from './random';

describe('initRandomService', () => {
  const log = jest.fn();

  beforeEach(() => {
    log.mockReset();
  });

  test('should work', (done) => {
    initRandomService({
      log,
    })
      .then((random) => {
        expect('function' === typeof random);
        expect(log.mock.calls).toMatchInlineSnapshot(`
          Array [
            Array [
              "debug",
              "🎲 - Random service initialized.",
            ],
          ]
        `);
      })
      .then(() => done())
      .catch(done);
  });

  describe('random', () => {
    test('should work', (done) => {
      initRandomService({
        log,
      })
        .then((random) => {
          log.mockClear();
          const num = random();

          expect(log.mock.calls).toEqual([
            ['debug', '🎲 - Created a random number:', num],
          ]);
        })
        .then(() => done())
        .catch(done);
    });
  });

  test('should work with Knifecycle', (done) => {
    new Knifecycle()
      .register(initRandomService)
      .register(constant('log', log))
      .run(['random'])
      .then(({ random }) => {
        expect(random).toBeDefined();
        expect(log.mock.calls).toMatchInlineSnapshot(`
          Array [
            Array [
              "debug",
              "🎲 - Random service initialized.",
            ],
          ]
        `);
      })
      .then(() => done())
      .catch(done);
  });
});
