/* @flow */
'use strict';

/**
 * @module Environment
 */
class Environment {
  PRODUCTION: string;
  DEVELOPMENT: string;
  environment: string;

  NEVADA: string;
  NEVADA_LIGHT: string;
  version: string;

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
     * @type {string} NEVADA
     */
    this.NEVADA = 'nevada';

    /**
     * @type {string} LIGHTWEIGHT
     */
    this.NEVADA_LIGHT = 'nevada-lightweight';

    /**
     * @type {string} environment
     * @private
     */
    this.environment = this.PRODUCTION;

    /**
     * @type {string} version
     */
    this.version = this.NEVADA;
  }

  /**
   * @method isDevelopment
   * @return {Boolean}
   */
  isDevelopment(): boolean {
    return (this.environment === this.DEVELOPMENT);
  }

  /**
   * @method isTest
   * @return {Boolean}
   */
  isTest(): boolean {
    return (process && process.env.NODE_ENV === 'test');
  }

  /**
   * @method useGlobalDOMAccess
   * @return {Boolean}
   */
  getVersion(): string {
    return this.version;
  }
}

export default new Environment();
