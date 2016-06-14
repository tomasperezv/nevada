/* @flow */
'use strict';

import DOMMutationEvents from './mutation-events';
import DOMMutationObserver from './mutation-observer';

/**
 * DOM Mutation Factory
 * An abstraction that allows us to abstract on what DOM Mutation API to use: Mutation Events or
 * Mutation Observer.
 *
 * Example of usage:
 *  import DOMMutationFactory from './dom-mutation/factory';
 *  const mutationObserver = DOMMutationFactory.get();
 *  const element = document.getElementById('test-element');
 *  mutationObserver.observe(element));
 *  ...
 *  // Mutation happens here
 *  ...
 *  assert(mutationObserver.getMutationData('addedNodes').length > 0);
 *  assert(mutationObserver.getMutationData('attributeName') === 'attribute-changed');
 */
class DOMMutationFactory {
  /**
   * Factory Method for building Mutation API's objects
   * @method get
   * @returns {DOMMutationObserver|DOMMutationEvents}
   * @static
   * @public
   */
  static get(): DOMMutationObserver|DOMMutationEvents {
    /**
     * @type {null|DOMMutationEvents|DOMMutationObserver} api
     */
    let api = null;

    // Decide which version of the mutation observer objects we can use.
    try {
      if (DOMMutationFactory.isMutationObserverAvailable()) {
        api = new DOMMutationObserver();
      } else {
        api = new DOMMutationEvents();
      }
    } catch (e) {
      /* eslint-line-disable no-empty */
    }

    if (api === null) {
      throw new Error('DOMMutationAdapter can\'t be initialized: no DOM Mutation API available.');
    }

    return api;
  }

  /**
   * The MutationObserver API is not available in very context, for instance we can't use it
   * when running the unit tests in the console with jsdom.
   *
   * @method isMutationObserverAvailable
   * @returns {Boolean}
   * @static
   * @public
   */
  static isMutationObserverAvailable(): boolean {
    return (typeof MutationObserver === 'function');
  }
}

export default DOMMutationFactory;
