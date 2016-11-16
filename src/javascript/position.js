/* @flow */
'use strict';

/**
 * Object for getting positions of DOM objects in our viewport/document
 * @module Position
 */
class Position {
  /**
   * Get position relative to viewport
   * @method get
   * @returns {Object}
   */
  get(target: Object): Object {
    return target.getBoundingClientRect();
  }

  /**
   * Get position relative to another element. By default, relative to body so
   * we can get an absolute position indeed
   * @method relativeGet
   * @returns {Object}
   */
  relativeGet(target: Object, relativeToElement: Object = document.body): Object {
    var result = {};
    var targetDOMRect = this.get(target);
    var relativeDOMRect = this.get(relativeToElement);

    Object.keys(targetDOMRect).forEach((key) => {
      if (relativeDOMRect.hasOwnProperty(key) && key !== 'width' && key !== 'height') {
        result[key] = targetDOMRect[key] - relativeDOMRect[key];
        console.log(key + ' ' + result[key]);
      }
    });

    return result;
  }
}

export default new Position();
