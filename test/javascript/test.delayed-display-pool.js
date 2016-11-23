'use strict';

import assert from 'assert';
import jsdom from 'mocha-jsdom';
import DelayedDisplayPool from '../../src/javascript/delayed-display-pool';
import Spy from '../../src/javascript/test-framework/spy';

/**
 * @test {DelayedDisplayPool}
 */
describe('DelayedDisplayPool', () => {
  // Initialize the fake DOM that jsdom exposes
  jsdom();

  /**
   * @test {DelayedDisplayPool#constructor}
   */
  it("It throws exception 'milliseconds has to be a number' if milliseconds argument" +
     "is not a number", () => {
    assert.throws(() => new DelayedDisplayPool('test', []),
      Error, 'milliseconds has to be a number');
  });

  /**
   * @test {DelayedDisplayPool#constructor}
   */
  it("It throws exception 'milliseconds has to be equals or bigger than 0 (milliseconds)' " +
     "if milliseconds argument is smaller than 0", () => {
    assert.throws(() => new DelayedDisplayPool(-1, []),
      Error, 'milliseconds has to be equals or bigger than 0 (milliseconds)');
  });

  /**
   * @test {DelayedDisplayPool#constructor}
   */
  it("It throws exception 'components has to be an array of components' " +
     "if components argument is not an array of objects", () => {
    assert.throws(() => new DelayedDisplayPool(1, 'test'),
      Error, 'components has to be an array of components');
    assert.throws(() => new DelayedDisplayPool(1, 12),
      Error, 'components has to be an array of components');
    assert.throws(() => new DelayedDisplayPool(1, []),
      Error, 'components has to be an array of components');
    assert.throws(() => new DelayedDisplayPool(1, () => {}),
      Error, 'components has to be an array of components');
    assert.throws(() => new DelayedDisplayPool(1, ['test']),
      Error, 'components has to be an array of components');
    assert.throws(() => new DelayedDisplayPool(1, [12]),
      Error, 'components has to be an array of components');
    assert.throws(() => new DelayedDisplayPool(1, [() => {}]),
      Error, 'components has to be an array of components');
  });

  /**
   * @test {DelayedDisplayPool#_showComponent}
   */
  it("show method has to be called if defined for a component", (done) =>  {
    const fakeComponent = { show: () => {
      done();
    }};

    const delayedPool = new DelayedDisplayPool(10, [fakeComponent]);
    delayedPool._showComponent(fakeComponent);
  });

  /**
   * @test {DelayedDisplayPool#_closeComponent}
   */
  it("It throws exception 'component doesn\'t respond to close method' if component " +
     "doesn't respond to close", () =>  {
    const delayedPool = new DelayedDisplayPool(10, [{}]);

    assert.throws(() => delayedPool._closeComponent(),
      Error, 'component doesn\'t respond to close method');
  });

  /**
   * @test {DelayedDisplayPool#_closeComponent}
   */
  it("show method has to be called if defined for a component", (done) =>  {
    const fakeComponent = {
      show: () => {},
      close: () => {
        done();
      }
    };

    var delayedPool = new DelayedDisplayPool(10, [fakeComponent]);
    delayedPool._closeComponent(fakeComponent);
  });

  /**
   * @test {DelayedDisplayPool#start}
   */
  it("It shows and close components sequencely", (done) =>  {
    const fakeComponent1 = {
      show: () => {},
      close: () => {}
    };

    const fakeComponent2 = {
      show: () => {},
      close: () => {
        done();
      }
    };

    var delayedPool = new DelayedDisplayPool(10, [fakeComponent1, fakeComponent2]);
    delayedPool.start();
  });

  /**
   * @test {DelayedDisplayPool#_isAnArrayOfObjects}
   */
  it("_isAnArrayOfObjects returns true if an array of objects is passed as argument", () => {
    const components = [{}];
    assert.ok((new DelayedDisplayPool(1, components)._isAnArrayOfObjects(components)));
  });
});
