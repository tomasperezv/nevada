import assert from 'assert';
import Logger from '../../src/coffeescript/logger.coffee';
import Spy from '../../src/javascript/test-framework/spy';

/**
 * @test {Logger}
 */
describe('Logger', () => {
  /**
   * @type {Logger|null} logger
   */
  let logger = null;

  /**
   * @method beforeEach
   * @private
   */
  beforeEach(() => {
    if (typeof global.window === 'undefined') {
      global.window = {};
    }
    logger = new Logger();
  });

  /**
   * @method afterEach
   * @private
   */
  afterEach(() => {
    logger = null;
  });

  /**
   * @test {Logger#debug}
   * @test {Logger#info}
   * @test {Logger#warn}
   * @test {Logger#error}
   */
  it('#debug #info #warn #error trigger console calls', () => {
    const ref = console;
    const spy = new Spy();
    const mock = spy.mock(console);

    const logMethods = ['debug', 'info', 'warn', 'error'];
    logMethods.map((currentMethod) => {
      logger[currentMethod]('test');
    });

    assert.equal(spy.get('log').count, logMethods.length);
    spy.restore(mock, ref);
  });
});
