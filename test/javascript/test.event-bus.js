import assert from 'assert';
import EventBus from '../../src/coffeescript/event_bus.coffee';

/**
 * @test {EventBus}
 */
describe('EventBus', () => {
  afterEach(() => {
    EventBus.clear();
  });

  /**
   * @test {EventBus#subscribe}
   * @test {EventBus#publish}
   */
  it('#subscribe listeners can subscribe to events', (done) => {
    const eventHandler = function(data) {
      assert.equal(typeof data, 'undefined');
      done();
    };

    EventBus.subscribe('testEvent', eventHandler);
    EventBus.publish('testEvent');
  });

  /**
   * @test {EventBus#subscribe}
   * @test {EventBus#publish}
   */
  it('#subscribe listeners receive events data', (done) => {
    const eventHandler = function(data) {
      assert.notEqual(typeof data, 'undefined');
      assert.equal(data.test, 'value');
      done();
    };

    EventBus.subscribe('testEvent', eventHandler);
    EventBus.publish('testEvent', { test: 'value' });
  });
});
