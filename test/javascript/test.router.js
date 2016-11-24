import jsdom from 'mocha-jsdom';
import assert from 'assert';
import DOMUtil from '../../src/javascript/test-framework/dom-util';

/**
 * @test {Router#on}
 */
describe('Router', () => {
  jsdom({
    url: 'http://test.tld/?param1=1&param2=2',
    skipWindowCheck: true
  });

  /**
   * @test {EventBus#subscribe}
   * @test {EventBus#publish}
   */
  it('Params are processed', (done) => {
    // Instantiate the Router object
    const Router = require('../../src/javascript/router').default;
    Router.on('navigation', (params) => {
      assert.equal(params.param1, '1');
      assert.equal(params.param2, '2');
      done();
    });

    DOMUtil.sendDOMContentLoadedEvent();
  });
});
