'use-strict';
import rawComponents from '../autoload-components';

/**
 * Encapsulates functionality in charge of generating the list of files
 * that compose the main core bundles: core and lightweight
 */
module.exports = {
  /**
   * @method base
   * @returns {Array}
   * @private
   */
  _base: () => {
    const components = rawComponents.map((current) => current.path);
    components.push('./src/javascript/modulejs-core');
    components.push('./src/javascript/emit-core-ready-event');
    return components;
  },

  /**
   * @method core
   * @returns {Array}
   * @public
   */
  core() {
    const components = this._base();
    components.unshift('./src/javascript/core/core.js');
    components.unshift('./src/javascript/core/base.js');
    return components;
  },

  /**
   * @method lightweight
   * @returns {Array}
   * @public
   */
  lightweight() {
    const components = this._base();
    components.unshift('./src/javascript/core/lightweight.js');
    components.unshift('./src/javascript/core/base.js');
    return components;
  }
};
