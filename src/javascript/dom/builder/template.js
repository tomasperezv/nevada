'use strict';

import Type from './type';
import TemplateStrategy from './template-strategy/base';
import EnumOptionTemplateStrategy from './template-strategy/enum-option';

class BuilderTemplate {
  /**
   * @constructor
   */
  constructor() {

    /**
     * @type {Object} _strategyMap
     * @private
     */
    this._strategyMap = {};

    this._initializeStrategyMap();
  }

  /**
   * @param {String} type
   * @method parse
   * @returns {String}
   */
  parse(type) {
    let strategy;
    if (typeof this._strategyMap[type] === 'undefined' ) {
      strategy = new TemplateStrategy(type);
    } else {
      strategy = new this._strategyMap[type]();
    }

    return strategy.getHTML();
  }

  /**
   * @method _initializeStrategyMap
   * @private
   */
  _initializeStrategyMap() {
    this._strategyMap[Type.EnumOption] = EnumOptionTemplateStrategy;
  }
}

export default BuilderTemplate;
