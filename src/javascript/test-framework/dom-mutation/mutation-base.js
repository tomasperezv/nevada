/* @flow */
'use strict';

/**
 * DOM Mutation base object, it defines the interface and common methods used by the mutation
 * observer objects.
 */
class DOMMutationBase {
  _node: Node|null;
  _mutationDataStorage: Map;
  _onDOMChange: Function|null;

  constructor() {
    /**
     * @type {Node|null} _node
     * @private
     */
    this._node = null;

    /**
     * Stores the mutation data. This information is accessed via the getMutationData method.
     *
     * @type {Map} _mutationDataStorage
     * @private
     */
    this._mutationDataStorage = new Map();

    /**
     * @type {Function|null} _onDOMChange
     * @private
     */
    this._onDOMChange = null;
  }

  /**
   * Are we observing already a DOM Node element?
   * @returns {Boolean}
   * @public
   */
  isActive(): boolean {
    return (this._node !== null);
  }

  /**
   * @param {Node} node
   * @method observe
   * @returns {Promise}
   * @public
   */
  observe(node: Node): Promise {
    if (this.isActive()) {
      this.restore();
    }

    this._assertInvalidElement(node);
    this._node = node;

    const self = this;
    return new Promise((resolve) => {
      self._attachMutationEvents(node, () => {
        resolve();
      });
    });
  }

  /**
   * @param {Node} node
   * @param {Function} onDOMChange
   * @method _attachMutationEvents
   * @private
   */
  /* eslint-disable no-unused-vars */
  _attachMutationEvents(node: Node, onDOMChange: Function): void {
    throw new Error('DOMMutation _attachMutationEvents is not implemented');
  }
  /* eslint-enable no-unused-vars */

  /**
   * @param {String} key
   * @param {Object|String|null} value
   * @method _setMutationData
   * @private
   */
  _setMutationData(key: string, value: Object|string|null) {
    this._mutationDataStorage.set(key, value);
  }

  /**
   * @method _assertInvalidElement
   * @param {Node} node
   * @throws Error
   * @private
   */
  _assertInvalidElement(node: Node): void {
    if (!(node instanceof Node)) {
      throw new Error('Trying to observe a non Node element');
    }
  }

  /**
   * Stop observing the previously watched DOM element
   * @method restore
   * @public
   */
  restore(): void {
    throw new Error('DOMMutation restore is not implemented');
  }

  /**
   * @param {String} key
   * @returns {Object|null}
   * @method getMutationData
   * @public
   */
  getMutationData(key: string): Object|void {
    return this._mutationDataStorage.get(key);
  }
}

export default DOMMutationBase;
