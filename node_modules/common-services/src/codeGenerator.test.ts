import initCodeGenerator from './codeGenerator';
import type { RandomService } from './random';

describe('codeGenerator', () => {
  const log = jest.fn();
  const random = jest.fn() as jest.Mock<number, RandomService[]>;

  beforeEach(() => {
    log.mockReset();
    random.mockReset();
  });

  test('should work', async () => {
    random.mockReturnValueOnce(0.5);
    const codeGenerator = await initCodeGenerator({
      random,
      log,
    });
    const code = await codeGenerator();

    expect({
      code,
      logCalls: log.mock.calls,
      randomCalls: random.mock.calls,
    }).toMatchSnapshot();
  });
});
