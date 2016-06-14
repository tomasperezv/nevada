import jsdom from 'mocha-jsdom';

/**
 * @test {EventBus}
 */
describe('emit-core-ready-event', () => {
  // Initialize the fake DOM that jsdom exposes
  jsdom();

  /**
   * @test {EventBus#subscribe}
   * @test {EventBus#publish}
   */
  it('The event is emitted on file inclusion', (done) => {
    window.addEventListener('jt-core-loaded', () => {
      done();
    });

    require('../../src/javascript/emit-core-ready-event');
  });
});
