/**
 * Usage:
 *   const bundleName = require('builder/bundle-name');
 *   const output = bundleName.generate(); // => ./dist/jt-fw-0.9.0[name]
 */
module.exports = {
  /**
   * @type {Object|null} _packageInfo
   * @private
   */
  _packageInfo: null,

  /**
   * @returns {Object}
   * @method _getPackageInfo
   * @private
   */
  _getPackageInfo() {
    if (this._packageInfo === null) {
      this._packageInfo = require('../../package.json');
    }

    return this._packageInfo;
  },

  /**
   * Returns the framework bundle name that corresponds based on its resource identifier.
   * @method generate
   * @returns {String}
   */
  generate() {
    var outputName = '';
    const packageInfo = this._getPackageInfo();
    outputName = this._replacePattern(packageInfo.bundle.pattern, {
      prefix: packageInfo.bundle.prefix,
      folder: packageInfo.bundle.folder,
      version: packageInfo.version
    });

    return outputName;
  },

  /**
   * @method getVersion
   * @returns {String}
   * @public
   */
  getVersion() {
    const packageInfo = this._getPackageInfo();
    return packageInfo.version;
  },

  /**
   * @returns {String}
   * @method compilationTime
   * @public
   */
  compilationTime() {
    return new Date().toLocaleDateString('en-US', {
      day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minutes: 'numeric'
    });
  },

  /**
   * @method getInfo
   * @returns {String}
   * @public
   */
  getInfo() {
    return `${this.getVersion()}, generated at ${this.compilationTime()} by ${process.env.USER}`;
  },

  /**
   * We iterate through the map of values that we want to replace, for instance:
   *  - valuesMap = {'something': 'MyValue'};
   *  - pattern = 'this-is-[something].js';
   * In this case we will return 'this-is-MyValue.js'
   *
   * @param {String} initialPattern
   * @param {Object} valuesMap
   * @method _replacePattern
   * @private
   */
  _replacePattern(initialPattern, valuesMap) {
    var result = initialPattern;
    Object.keys(valuesMap).forEach((key) => {
      result = result.replace(`[${key}]`, valuesMap[key]);
    });

    return result;
  }
};
