'use strict';

class Base {

  /**
   * @param {String} type
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
     * @type {null|Element} _html
     * @private
     */
    this._html = null;

    this._setHTML();
  }

  /**
   * @method _setHTML
   * @private
   */
  _setHTML() {
    const container = document.createElement('div');
    container.innerHTML = this._script !== null ? this._script.innerHTML : this._fallbackContainer;
    this._html = container.firstElementChild;
  }

  /**
   * @method getHTML
   * @private
   */
  getHTML() {
    return this._html;
  }
}

export default Base;
