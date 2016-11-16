/* @flow */
'use strict';

/**
 * Object for getting positions of DOM objects in our viewport/document
 * @module Position
 */
class Position {
  _from: Element;

  /**
   * @param {Element} from
   * @constructor
   */
  constructor(from: Element): void {
    this._from = from;

    if (typeof this._from === 'undefined' || this._from.nodeType !== Node.ELEMENT_NODE) {
      throw new Error('An Element must be passed as argument');
    }
  }

  /**
   * Get position relative to viewport
   * @method get
   * @returns {Object}
   */
  get(): Object {
    return this._from.getBoundingClientRect();
  }

  /**
   * Get position relative to another element. By default, relative to body so
   * we can get an absolute position indeed
   * @method relativeGet
   * @param {Object} relativeTo
   * @returns {Object}
   */
  relativeGet(relativeTo: Object = document.body): Object {
    if (relativeTo.nodeType !== Node.DOCUMENT_NODE &&
        relativeTo.nodeType !== Node.ELEMENT_NODE) {
      throw new Error('Relative element must have Document or Element node type');
    }

    const result = {};
    const fromDOMRect = this.get(this._from);
    const relativeToDOMRect = relativeTo.getBoundingClientRect();

    Object.keys(fromDOMRect).forEach((key) => {
      if (relativeToDOMRect.hasOwnProperty(key) && key !== 'width' && key !== 'height') {
        result[key] = fromDOMRect[key] - relativeToDOMRect[key];
      }
    });

    return result;
  }
}

export default Position;
