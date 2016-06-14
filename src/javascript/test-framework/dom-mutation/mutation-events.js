/* @flow */
'use strict';

import DOMMutationBase from './mutation-base';

/**
 * DOM Mutation Events
 * Abstract layer on top of DOM Mutation Events API which is deprecated however we need to
 * use it in order to be able to observe DOM changes in all of the environments.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Mutation_events
 */
class DOMMutationEvents extends DOMMutationBase {
  _eventListeners: Object;

  constructor() {
    super();

    /**
     * @type {DOMMutationEvents} self
     */
    const self = this;

    /**
     * @type {Object} _eventListeners
     * @private
     */
    this._eventListeners = {
      DOMAttrModified(eventData: Object): void {
        // null values on prevValue entry are stored as a string, we need to restore the
        // original null type
        let oldValue = eventData.prevValue;
        if (oldValue === 'null') {
          oldValue = null;
        }

        self._setMutationData('type', 'attributes');
        self._setMutationData('attributeName', eventData.attrName);
        self._setMutationData('newValue', eventData.newValue);
        self._setMutationData('oldValue', oldValue);
      },

      DOMNodeInserted(eventData: Object): void {
        self._setMutationData('type', 'childList');
        self._setMutationData('element', eventData.target);
      },

      DOMNodeRemoved(eventData: Object): void {
        self._setMutationData('type', 'childList');
        self._setMutationData('element', eventData.target);
      }
    };
  }

  /**
   * @param {Node} node
   * @param {Function} onDOMChange
   * @method _attachMutationEvents
   * @private
   */
  _attachMutationEvents(node: Node, onDOMChange: Function): void {
    const self = this;
    Object.keys(this._eventListeners).forEach((eventKey) => {
      node.addEventListener(eventKey, (eventData) => {
        self._eventListeners[eventKey](eventData);
        onDOMChange();
      });
    });
  }

  /**
   * Stop observing the previously watched DOM element
   * @method restore
   * @public
   */
  restore(): void {
    if (this.isActive()) {
      const self = this;
      Object.keys(this._eventListeners).forEach((eventKey) => {
        if (self._node !== null) {
          self._node.removeEventListener(eventKey, self._eventListeners[eventKey]);
        }
      });

      this._mutationDataStorage.clear();
    }
  }
}

export default DOMMutationEvents;
