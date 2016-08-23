'use strict';

import Type from './type';
import { Map as TypeMap } from './type';

class FragmentFactory {
  /**
   * @constructor
   */
  constructor() {
    /**
     * @type {Object} _intercepts
     * @private
     */
    this._intercepts = {};
  }

  /**
   * @method create
   * @param {Object} params
   * @returns {FragmentComponent}
   * @public
   */
  create(params) {
    this._validate(params);

    if (typeof this._intercepts[params.type] !== 'undefined') {
      params.decorators = this._intercepts[params.type];
    }

    return this._instantiate(params);
  }

  /**
   * @method _instantiate
   * @param {Object} params
   * @private
   */
  _instantiate(params) {
    let Component;
    if (typeof TypeMap[params.type] !== 'undefined') {
      Component = TypeMap[params.type];
    } else {
      const fallback = typeof params.fallback !== 'undefined' ? params.fallback : Type.String;
      Component = TypeMap[fallback];
    }

    return new Component(params, params.type);
  }

  /**
   * @method _validate
   * @private
   */
  _validate(params) {
    if (typeof params.data === 'undefined') {
      throw new Error('Missing fragment data');
    }

    if (typeof params.type === 'undefined') {
      throw new Error('Missing fragment type');
    }
  }

  /**
   * Intercept further object instantiation augmenting decorators content
   * @param {String} type
   * @param {Object} decorators
   * @method intercept
   */
  intercept(type, decorators) {
    this._intercepts[type] = decorators;
  }
}

const fragmentFactory = new FragmentFactory();
export { fragmentFactory as Factory };
