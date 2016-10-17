'use strict';

class EnumOptionTemplateStrategy {

  /**
   * @constructor
   */
  constructor(type) {
    /**
     * @type {Element} html
     * @private
     */
    this.html = document.createElement('option');
  }

  getHTML() {
    return this.html;
  }
}

export default EnumOptionTemplateStrategy;
