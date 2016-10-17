'use strict';

class Base {

  /**
   * @constructor
   */
  constructor(type) {
    /**
     * Used to compose the template id's
     * @type {String} _templatePrefix
     * @private
     */
    this._templatePrefix = 'dom-builder';

    /**
     * @type {String} _fallbackContainer
     * @private
     */
    this._fallbackContainer = '<div></div>'

    /**
     * @type {HTMLElement} _script
     * @private
     */
    this._script = document.getElementById(`${this._templatePrefix}-${type}`);

    /**
     * @type {null|Element} html
     * @private
     */
    this.html = null;

    this._setHTML();
  }


  _setHTML() {
    const container = document.createElement('div');
    container.innerHTML = this._script !== null ? this._script.innerHTML : this._fallbackContainer;
    this.html = container.firstElementChild;
  }

  getHTML() {
    return this.html;
  }
}

export default Base;
