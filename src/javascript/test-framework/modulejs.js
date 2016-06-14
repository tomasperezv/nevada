/* @flow */
'use strict';

/**
 * The following module defines a Mock for ModuleJS
 *
 * - Usage:
 *   ```javascript
 *     const ModuleJSMock = require('test-framework/modulejs');
 *
 *     var module = new ModuleJSMock();
 *     var UploadFileModule = moduleJSMock.getModule('UploadFile');
 *     var uploadFile = new UploadFileModule();
 *   ```
 *
 * @module ModuleJS
 */
import Mock from './mock';

/**
 * Defines a Mock for ModuleJS
 */
class ModuleJS extends Mock {
  _modules: Object;

  /**
   * @constructor
   */
  constructor() {
    super('modulejs');

    /**
     * Stores modules encapsulated by modulejs
     * @type {Object} _modules
     * @private
     */
    this._modules = {};

    var self = this;

    /**
     * @type {Object|Function|null} mock
     * @private
     */
    this._mock = {
      /**
       * @param {String} moduleId
       * @method define
       */
      define(moduleId: string): void {
        var constructor = arguments[arguments.length - 1];
        var dependencies = [];
        if (arguments.length > 2) {
          dependencies = arguments[1].map((dependency) => self._modules[dependency]);
        }
        self._modules[moduleId] = constructor.apply(null, dependencies);
      },
      /**
       * @param {String} moduleName
       * @returns {Object|null}
       * @method require
       */
      require(moduleName: string): Object|null {
        return typeof self._modules[moduleName] !== 'undefined' ? self._modules[moduleName] : null;
      }
    };
  }

  /**
   * Returns the module encapsulated by modulejs.
   * @param {String} id
   * @method getModule
   * @returns {null|Object}
   * @public
   */
  getModule(id:string): Object|null {
    // Modulejs uses internally the nomenclature 'ObjectModule', in order to
    // improve readability we are abstracting for that so you just need to do
    // ModuleJS.getModule('Object') instead of ModuleJs.getModule('ObjectModule').
    const moduleName = `${id}Module`;
    return this._modules[moduleName] !== 'undefined' ? this._modules[moduleName] : null;
  }
}

module.exports = new ModuleJS();
