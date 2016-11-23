/* @flow */
'use strict';

/**
 * Used for show/hide components sequencely
 * @module DisplayPool
 */
class DelayedDisplayPool {
  _milliseconds: number;
  _components: Array;

  /**
   * @param {number} ms
   * @param {Array} components
   * @constructor
   */
  constructor(milliseconds = 0, components: Array<Object>) {
    this._milliseconds = milliseconds;
    this._components = components;
    this.$ = require('./dom/core');

    if (typeof this._milliseconds !== 'number') {
      throw new Error('ms has to be a number');
    }

    if (this._milliseconds < 0) {
      throw new Error('ms has to be equals or bigger than 0 (ms)');
    }

    if (Object.prototype.toString.call(components) !== '[object Array]') {
      throw new Error('components has to be an array of components');
    }
  }

  /**
   * @method start
   * @public
   */
  start(): void {
    const self = this;
    this._components.reduce((promise, component) => {
      return promise.then(() => {
        self._showComponent(component);
        return self._delayClose(component);
      }, (error) => {
        throw new Error(error);
      });
    }, self.$.Deferred().resolve());
  }

  /**
   * @param {Object} component
   * @method _showComponent
   * @private
   */
  _showComponent(component: Object): void {
    if (typeof component.show !== 'function') {
      throw new Error("component doesn't respond to show method");
    } else {
      component.show();
    }
  }

  /**
   * @param {Object} component
   * @method _closeComponent
   * @private
   */
  _closeComponent(component: Object): void {
    if (typeof component.close !== 'function') {
      throw new Error("component doesn't respond to close method");
    } else {
      component.close();
    }
  }

  /**
   * @param {component} ms
   * @method _closeComponent
   * @private
   */
  _delayClose(component: Object): Object {
    const deferred = this.$.Deferred();
    const self = this;

    setTimeout(() => {
      try {
        self._closeComponent(component);
      } catch (error) {
        deferred.reject(error);
      }
      deferred.resolve();
    }, self._milliseconds);

    return deferred.promise();
  }
}

export default DelayedDisplayPool;
