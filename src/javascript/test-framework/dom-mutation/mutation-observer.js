/* @flow */
'use strict';

import DOMMutationBase from './mutation-base';

/**
 * DOM Mutation Observer
 * Abstract layer on top of DOM Mutation Observer.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
 */
class DOMMutationObserver extends DOMMutationBase {
  _observer: Object|null;
  _config: Object;

  constructor() {
    super();

    /**
     * @type {MutationObserver|null} _observer
     * @private
     */
    this._observer = null;

    /**
     * @type {Object} _config
     * @private
     */
    this._config = {
      attributes: true,
      childList: true,
      characterData: true,
      attributeOldValue: true,
      subtree: true,
      characterDataOldValue: true
    };
  }

  /**
   * @param {Node} node
   * @param {Function} onDOMChange
   * @method _attachMutationEvents
   * @private
   * @see https://developer.mozilla.org/en-US/docs/Web/API/MutationRecord
   */
  _attachMutationEvents(node: Node, onDOMChange: Function): void {
    const self = this;
    this._observer = new MutationObserver((mutations) => {
      // Only use the latest mutation
      const mutation = mutations[mutations.length - 1];
      const attributeName = mutation.attributeName;

      self._setMutationData('type', mutation.type);
      self._setMutationData('attributeName', attributeName);
      // $FlowFixMe: Special type conflict we can't solve easily
      self._setMutationData('newValue', mutation.target.getAttribute(attributeName));
      self._setMutationData('oldValue', mutation.oldValue);

      if (mutation.addedNodes.length > 0) {
        self._setMutationData('element', mutation.addedNodes[0]);
      }

      if (mutation.removedNodes.length > 0) {
        self._setMutationData('element', mutation.removedNodes[0]);
      }

      onDOMChange();
    });

    this._observer.observe(node, this._config);
  }

  /**
   * Stop observing the previously watched DOM element
   * @method restore
   * @public
   */
  restore(): void {
    if (this._observer !== null) {
      this._observer.disconnect();
      this._mutationDataStorage.clear();
    }
  }

}

export default DOMMutationObserver;
