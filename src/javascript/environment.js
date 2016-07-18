/* @flow */
'use strict';

/**
 * @module Environment
 */
class Environment {
  PRODUCTION: string;
  DEVELOPMENT: string;
  environment: string;

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
    this.environment = this.PRODUCTION;
  }

  /**
   * @method isDevelopment
   * @return {Boolean}
   */
  isDevelopment(): boolean {
    return (this.environment === this.DEVELOPMENT);
  }
}

export default new Environment();
