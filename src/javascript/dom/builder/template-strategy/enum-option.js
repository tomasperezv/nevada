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
   * @method _getHTML
   * @private
   */
  getHTML() {
    return this._html;
  }
}

export default EnumOptionTemplateStrategy;
