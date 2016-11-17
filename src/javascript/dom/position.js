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
    return this._clientRectToEnumerable(this._from.getBoundingClientRect());
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
    const relativeToDOMRect = this._clientRectToEnumerable(relativeTo.getBoundingClientRect());

    Object.keys(fromDOMRect).forEach((key) => {
      if (relativeToDOMRect.hasOwnProperty(key)) {
        if (key !== 'width' && key !== 'height') {
          result[key] = fromDOMRect[key] - relativeToDOMRect[key];
        } else {
          result[key] = fromDOMRect[key];
        }
      }
    });
    
    return result;
  }

  /**
   * Set new position top and/or left to element. New postion will be taken into account
   * only if element is absolute, relative or fixed positioned.
   * @method set
   * @param {Object} position
   * @returns {Object}
   */
  set(position: Object = {}): void {
    if (!position.hasOwnProperty('top') && !position.hasOwnProperty('left')) {
      throw new Error('Position needs top or left or both keys to be applied');
    }

    if (position.hasOwnProperty('top')) {
      this._from.style.top = position.top;
    }

    if (position.hasOwnProperty('left')) {
      this._from.style.left = position.left;
    }
  }

  /**
   * ClientRect object is not Enumerable, so we cannot use Object.keys to get its keys for looping
   * This method returns an Enumerable object with same keys and values than client object passed
   * by argument. Used by Position#get to returns same kind of object than relativeGet
   * @method _clientRectToEnumerable
   * @param {Object} clientRectObject
   * @returns {Object}
   */
  _clientRectToEnumerable(clientRectObject: Object): void {
    if (typeof clientRectObject === 'undefined') {
      throw new Error('ClientRect argument is undefined');
    }

    const obj = {};

    for (let key in clientRectObject) {
      obj[key] = clientRectObject[key]
    }

    return obj;
  }
}

export default Position;
