/* @flow */
'use strict';

/**
 * @module Environment
 */
class Environment {
  PRODUCTION: string;
  DEVELOPMENT: string;
  _environment: string;

  constructor() {
    /**
     * @type {string} PRODUCTION
     */
    this.PRODUCTION = 'production';

    /**
     * @type {string} DEVELOPMENT
     */
    this.DEVELOPMENT = 'development';

    /**
     * @type {string} _environment
     * @private
     */
    this._environment = this.PRODUCTION;
  }

  /**
   * @param {string} environment
   * @public
   */
  set environment(environment: string): void {
    this._environment = environment;
  }

  /**
   * @return {string}
   * @public
   */
  get environment(): string {
    return this._environment;
  }

  /**
   * @method isDevelopment
   * @return {Boolean}
   */
  isDevelopment(): boolean {
    return (this._environment === this.DEVELOPMENT);
  }
}

export default new Environment();
