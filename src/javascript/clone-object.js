/* @flow */
'use strict';

/**
 * Adapter object for storing data in cookies without depending on a specific implementation.
 * @module CloneObject
 * @see https://www.npmjs.com/package/js-cookiethis._storage(id);
 */
class CloneObject {
  /**
   * @method clone
   * @returns {Object}
   */
  clone(sourceObject: Object): Object {
    return Object.assign({}, sourceObject);
  }

  /**
   * @param {Object} sourceObject
   * @param {Array} keys
   * @method cloneWithout
   * @returns {Object}
   */
  cloneWithout(sourceObject: Object, keys: Array<string>) {
    const resultObject = this.clone(sourceObject);
    keys.forEach((currentKey) => {
      delete resultObject[currentKey];
    });

    return resultObject;
  }
}

export default new CloneObject();
