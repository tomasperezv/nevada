/* @flow */
'use strict';

/**
 * Base object for global injection
 */
class Inject {

  /**
   * Assures compatibility between different environments (nodejs headless vs browser),
   * in order to support multiple execution modes.
   *
   * @method _getGlobalObject
   * @returns {Object}
   * @private
   */
  static _getGlobalObject(): Object {
    return typeof global === 'undefined' ? window : global;
  }

  /**
   * Injects the encapsulated object in the global scope
   * @param  {Object} instance
   * @param  {String} id
   * @method attach
   * @public
   */
  static attach(instance: Object|null, id: string): void {
    var global = Inject._getGlobalObject();
    Object.defineProperty(global, id, { configurable: true, writable: true });
    global[id] = instance;
  }

  /**
   * Removes the mocked object from the global scope
   * @param  {String} id
   * @method destroy
   * @public
   */
  static destroy(id: string): void {
    var global = Inject._getGlobalObject();
    delete global[id];
  }

}

export default Inject;
