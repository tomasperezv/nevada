'use strict';

class EnumOptionTemplateStrategy {

  /**
   * @param {String} type
   * @constructor
   */
  constructor(type) {
    /**
     * @type {Element} _html
     * @private
     */
    this._html = document.createElement('option');
  }

  /**
   * @method getHTML
   */
  getHTML() {
    return this._html;
  }
}

export default EnumOptionTemplateStrategy;
