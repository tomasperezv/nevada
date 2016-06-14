/* @flow */
'use strict';

// Required to provide Request object support
import Reflect from 'core-js/library/es6/reflect';

/**
 * Defines a Proxy Handler used by the Proxy interceptor object.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
 * @module ProxySpyHandler
 */
class ProxySpyHandler {
  _exceptions: Array<string>;
  _spyMap: Map<string, Object>;
  _proxyHandler: Object;
  __modulejs__: boolean;

  /**
   * @param {Object} target
   * @param {Array} exceptions
   */
  constructor(target: Object, exceptions: Array<string>) {
    const self = this;

    /**
     * @type {Array} _exceptions
     * @private
     */
    this._exceptions = exceptions || [];

    /**
     * @type {Boolean} __modulejs__
     * @private
     */
    this.__modulejs__ = false;

    /**
     * Storage of the methods and properties that we want to observe
     * @type {Map} _spyMap
     * @private
     */
    this._spyMap = new Map();

    /**
     * @type {Object} _proxyHandler
     * @private
     */
    this._proxyHandler = {
      getOwnPropertyDescriptor: (obj, prop): Object => {
        const value = target[prop];
        return { configurable: true, enumerable: true, value };
      },

      get(obj: Object, key: string): Object|null {
        const originalValue = Reflect.get(target, key);
        let result = originalValue;

        if (typeof originalValue === 'function') {
          if (self._exceptions.indexOf(key) === -1) {
            result = () => {
              self._registerAccess(key, originalValue !== undefined);
            };
          } else {
            self._registerAccess(key, originalValue !== undefined);
          }
        } else {
          self._registerAccess(key, originalValue !== undefined);
        }

        return result;
      },

      set(obj: Object, key: string): boolean {
        self._registerAccess(key, typeof target[key] !== 'undefined');
        return true;
      }
    };
  }

  /**
   * @param {String} propertyName
   * @param {Boolean} isDefined true if the property exists
   * @method _registerAccess
   * @private
   */
  _registerAccess(propertyName: string, isDefined: boolean): void {
    let register = {
      count: 0,
      called: false,
      isDefined
    };

    if (this._spyMap.has(propertyName)) {
      // This provides types safety
      const registerCandidate = this._spyMap.get(propertyName);
      if (typeof registerCandidate !== 'undefined') {
        register = registerCandidate;
      }
    }

    register.count++;
    register.called = true;
    this._spyMap.set(propertyName, register);
  }

  /**
   * @returns {ProxyHandler}
   * @method get
   * @public
   */
  get(): Object {
    return this._proxyHandler;
  }

  /**
   * @param {String} propertyName
   * @returns {Object}
   * @method getPropertyRegister
   * @public
   */
  getPropertyRegister(propertyName: string): Object|null {
    const register = this._spyMap.get(propertyName);
    return typeof register !== 'undefined' ? register : null;
  }
}

export default ProxySpyHandler;
