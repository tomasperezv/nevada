'use strict';

class FragmentBuilder {
  /**
   * @param {Object} options
   * @constructor
   */
  constructor() {
    /**
     * Cache the template fragments
     * @type {Object} _templates
     * @private
     */
    this._templates = {};

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
    this._fallbackContainer = '<div></div>';
  }

  /**
   * @param {String} type
   * @returns {DocumentFragment}
   * @method get
   * @public
   */
  get(type) {
    if (typeof type === 'undefined') {
      throw new Error('The fragment builder requires a type param');
    }

    let fragment;
    if (typeof this._templates[type] === 'undefined') {
      fragment = this._build(type);
      this._templates[type] = fragment;
    } else {
      fragment = this._templates[type];
    }

    return fragment.cloneNode(true);
  }

  /**
   * @param {String} type
   * @returns {DocumentFragment}
   * @method _build
   * @private
   */
  _build(type) {
    const template = this._parseStringTemplate(type);
    const fragment = document.createDocumentFragment();
    fragment.appendChild(template);

    return fragment;
  }

  /**
   * @param {String} type
   * @method _parseStringTemplate
   * @returns {HTMLElement|null}
   * @private
   */
  _parseStringTemplate(type) {
    const script = document.getElementById(`${this._templatePrefix}-${type}`);
    const container = document.createElement('div');
    container.innerHTML = script !== null ? script.innerHTML : this._fallbackContainer;

    return container.firstElementChild;
  }

  /**
   * @method clear
   */
  clear() {
    this._templates = {};
  }
}

export default new FragmentBuilder();
