/* @flow */
'use strict';

/**
 * Used for show/hide components sequencely
 * @module DisplayPool
 */
class DelayedDisplayPool {
  _ms: number;
  _components: Array;

  /**
   * @param {number} ms
   * @param {Array} components
   * @constructor
   */
  constructor(ms = 0, components: Array<Object>) {
    this._ms = ms;
    this._components = components;
    this.$ = require('./dom/core');

    if (typeof this._ms !== 'number') {
      throw new Error('ms has to be a number');
    }

    if (this._ms < 0) {
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
    var _this = this;
    this._components.reduce((promise, component) => {
      return promise.then(() => {
        _this._showComponent(component);
        return _this._delayClose(component);
      }, (error) => {
        throw new Error(error);
      });
    }, _this.$.Deferred().resolve());
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
    const _this = this;

    setTimeout(() => {
      try {
        _this._closeComponent(component);
      } catch (error) {
        deferred.reject(error);
      }
      deferred.resolve();
    }, _this._ms);

    return deferred.promise();
  }
}

export default DelayedDisplayPool;
