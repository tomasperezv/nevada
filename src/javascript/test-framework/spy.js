/* @flow */
'use strict';

import Inject from './inject';
import ProxyHandler from './proxy-spy-handler';
import ModuleJS from 'modulejs';

declare class Proxy {
  create(handler: ProxyHandler, proto: Object): Proxy;
  constructor(proto: Object, handler: ProxyHandler): void;
}

/**
 * The following module defines a Spy object used to intercept
 * operations on object methods and properties.
 *
 * Example of usage:
 *   ```javascript
 *     import Spy from 'test-framework/spy';
 *     const objectToSpy = { method: function() {} };
 *     var spy = new Spy();
 *     const spied = spy.watch(objectToSpy);
 *     spied.method();
 *     assert(spied.count === 1);
 *     assert(spied.called === true);
 *   ```
 *
 * It adds a layer on top of the es6 `Proxy` object combined with Reflect API,
 * that way we can intercept method and property calls, both defined and undefined.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
 * @module Spy
 */
class Spy {
  _mockedObjectExtensions: Function;
  _originalObject: Object;
  _handler: ProxyHandler|null;
  _spiedObjectsSet: WeakSet<Object>;

  constructor() {
    const self = this;

    /**
     * @private
     */
    /* eslint-disable arrow-body-style */
    this._mockedObjectExtensions = (name: string) => {
      return {
        __restore__() {
          self._spiedObjectsSet.delete(self._originalObject);
          if (self._handler !== null && !self._handler.__modulejs__) {
            Inject.attach(self._originalObject, name);
          } else {
            delete ModuleJS._d[name];
            ModuleJS.define(name, self._originalObject);
          }
          self._handler = null;
        }
      };
    };
    /* eslint-enable arrow-body-style */

    /**
     * @private
     */
    this._originalObject = {};

    /**
     * @private
     */
    this._handler = null;

    /**
     * @private
     */
    this._spiedObjectsSet = new WeakSet();
  }

  /**
   * @param {Object} instance
   * @param {String} method
   * @param {Function|undefined} stub
   * @method intercept
   * @public
   */
  intercept(instance: Object, method: String, stub: Function|void) {
    const original = instance[method];
    /* eslint-disable no-param-reassign */
    instance[method] = (...args) => {
      instance[method].counter++;
      instance[method].called = true;

      let callResult = null;
      if (typeof stub === 'function') {
        callResult = stub.apply(instance, args);
      } else {
        callResult = original.apply(instance, args);
      }

      return callResult;
    };

    instance[method].restore = function() {
      instance[method] = original;
    };

    instance[method].counter = 0;
    instance[method].called = false;
    instance[method].__spy__ = true;
    /* eslint-enable no-param-reassign */
  }

  /**
   * Checks if a method is being watched
   * @param {Object} instance
   * @param {String} method
   * @public
   */
  watched(instance: Object, method: String): boolean {
    return (typeof instance[method].__spy__ !== 'undefined');
  }

  /**
   * Removes the spy layer on an object's method
   * @param {ProxyHandler} mock
   * @public
   */
  restore(mock: ProxyHandler) {
    if (typeof mock.__restore__ === 'function') {
      mock.__restore__();
    }
  }

  /**
   * Watch an object methods and properties via a proxy
   * @param {Object} instance
   * @returns {Proxy}
   * @public
   */
  watch(instance: Object): Proxy {
    this._assertAndRegisterObjectOverride(instance);

    this._handler = new ProxyHandler(instance, Object.keys(this._mockedObjectExtensions()));
    return this._initializeProxy(this._handler.get(), Object.getPrototypeOf(instance));
  }

  /**
   * Initializes a proxy object
   * @param {ProxyHandler} handler
   * @param {Object} proto
   * @private
   */
  _initializeProxy(handler: ProxyHandler, proto: Object): Proxy {
    let proxy;
    if (typeof Proxy.create !== 'undefined') {
      proxy = Proxy.create(handler, proto);
    } else {
      proxy = new Proxy(proto, handler);
    }
    return proxy;
  }

  /**
   * @throws Error
   * @param {Object} instance
   * @private
   */
  _assertAndRegisterObjectOverride(instance: Object) {
    if (this._spiedObjectsSet.has(instance)) {
      throw new Error('Spy can\'t attach to objects that are already being spied');
    }

    this._spiedObjectsSet.add(instance);
  }

  /**
   * @param {String} name
   * @returns {Object|null}
   * @public
   */
  get(name: string): Object|null {
    return this._handler !== null ? this._handler.getPropertyRegister(name) : null;
  }

  /**
   * Creates a proxy object
   * @param  {Object} object
   * @param  {String} id
   * @param {Boolean} useModuleJS
   * @returns {ProxyHandler}
   * @public
   */
  mock(object: Object, id: string, useModuleJS: boolean = false): Proxy {
    /* eslint-disable no-param-reassign */
    this._originalObject = object;

    let name = this._processObjectName(object.constructor.name);
    if (typeof id !== 'undefined') {
      name = id;
    }

    var objectExtensions = this._mockedObjectExtensions(name);
    Object.keys(objectExtensions).forEach((key) => {
      object[key] = objectExtensions[key];
    });

    const proxy = this.watch(object);
    if (useModuleJS) {
      if (typeof ModuleJS._d[name] !== 'undefined') {
        delete ModuleJS._d[name];
      }

      ModuleJS.define(name, () => proxy);
      if (this._handler !== null) {
        this._handler.__modulejs__ = true;
      }
    } else {
      Inject.attach(proxy, name);
    }

    /* eslint-enable no-param-reassign */
    return proxy;
  }

  /**
   * Converts the first character of a string to lowercase
   * @param {String} name
   * @returns {String}
   * @private
   */
  _processObjectName(name: string): string {
    return `${name[0].toLowerCase()}${name.slice(1)}`;
  }
}

export default Spy;
