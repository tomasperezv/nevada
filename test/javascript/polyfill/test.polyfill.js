'use strict';

import assert from 'assert';
import jsdom from 'mocha-jsdom';

/**
 * @test {Polyfill}
 */
describe('Polyfill', () => {
  // Initialize the DOM
  jsdom();

  it('customEvent', () => {
    window.CustomEvent = null;
    assert.equal(window.CustomEvent, null);
    require('../../../src/javascript/polyfill/custom-event');
    assert.equal(typeof window.CustomEvent, 'function');
  });

  it('addEventListener', () => {
    // addEventListener is already present in the test execution environments (browser and node), so the goal
    // of this test is first of all to check that the polyfill does not break anything and the function still
    // available after the polyfill is injected.
    require('../../../src/javascript/polyfill/add-event-listener');
    assert.equal(typeof window.addEventListener, 'function');
  });
});
