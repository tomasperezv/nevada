/**
 * @module JTFrontend
 */
class JTFrontend {
  constructor() {
    /**
     * @type {string} _environment
     * @private
     */
    this._environment = 'production';
  }

  /**
   * @param {string} environment
   * @public
   */
  set environment(environment) {
    this._environment = environment;
  }

  /**
   * @returns {string}
   * @public
   */
  get environment() {
    return this._environment;
  }
}

export default new JTFrontend();

