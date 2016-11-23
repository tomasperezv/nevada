/* @flow */
'use strict';

/**
 * Used for show/hide components sequencely
 * @module DelayedDisplayPool
 */
class DelayedDisplayPool {
  _milliseconds: number;
  _components: Array;

  /**
   * @param {number} milliseconds
   * @param {Array} components
   * @constructor
   */
  constructor(milliseconds = 0, components: Array<Object>) {
    this.$ = require('./dom/core');

    if (typeof milliseconds !== 'number') {
      throw new Error('milliseconds has to be a number');
    }

    if (milliseconds < 0) {
      throw new Error('milliseconds has to be equals or bigger than 0 (milliseconds)');
    }

    this._milliseconds = milliseconds;

    if (!this._isAnArrayOfObjects(components)) {
      throw new Error('components has to be an array of components');
    }

    this._components = components;
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
    }, Promise.resolve());
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
   * @param {Object} component
   * @method _delayClose
   * @returns {Object}
   * @private
   */
  _delayClose(component: Object): Object {
    const self = this;

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          self._closeComponent(component);
          resolve();
        } catch (error) {
          reject(error);
        }
      }, self._milliseconds);
    });
  }

  /**
   * @param {Array} components
   * @method _isAnArrayOfObjects
   * @returns {boolean}
   * @private
   */
  _isAnArrayOfObjects(components: Array<Object>): boolean {
    return Array.isArray(components) && components.every(component => typeof component === 'object');
  }
}

export default DelayedDisplayPool;
