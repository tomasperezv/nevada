/* @flow */
'use strict';

import Inject from './inject';

/**
 * Base object for Mock objects
 */
class Mock {
  _id: string;
  _mock: Object|Function|null;


  /**
   * @param {String} id
   * @constructor
   */
  constructor(id: string) {
    /**
     * @var {String} _id
     * @private
     */
    this._id = id;

    /**
     * The _mock object contains the object that represents the functionality
     * that we wan to emulate. If we want to inspect its usage via sinon, that
     * can be done accessing to the object by the MockModule.get() method,
     * as in the following example:
     * ```javascript
     *   var mock = MockModule.get();
     *   sinon.spy(mock, 'method');
     *   assertTrue(mock.method.called);
     * ```
     *
     * @var {Object|Function|null} _mock
     * @private
     */
    this._mock = null;
  }

  /**
   * Injects the encapsulated object in the global scope
   * @method attach
   * @public
   */
  attach(): void {
    Inject.attach(this._mock, this._id);
  }

  /**
   * Removes the mocked object from the global scope
   * @method destroy
   * @public
   */
  destroy(): void {
    Inject.destroy(this._id);
  }

  /**
   * Exposes the mocked object
   * @returns {Object|null}
   * @method get
   * @public
   */
  get mock(): Object|null {
    return this._mock;
  }

  /**
   * Assigns the mocked object
   * @param {Object|null} mock
   * @method set
   * @public
   */
  set mock(mock: Object|null): void {
    this._mock = mock;
  }
}

export default Mock;
