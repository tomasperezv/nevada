'use strict';
import path from 'path';
import fs from 'fs';

/**
 * A custom webpack plugin that copies the latest version of the static files in the dist folder.
 * @see https://webpack.github.io/docs/plugins.html
 * @module GenerateLatest
 */
class GenerateLatest {
  /**
   * @param {Object} options
   * @constructor
   */
  constructor(options) {
    if (typeof options.version === 'undefined') {
      throw new Error('GenerateLatest requires a static file version as a configuration entry.');
    }

    this._version = options.version;
  }

  /**
   * @param {Object} compiler
   * @method apply
   * @public
   */
  apply(compiler) {
    const self = this;
    compiler.plugin('done', () => {
      self._generate();
    });
  }

  /**
   * @method _getNewFilename
   * @return {String}
   * @private
   */
  _getNewFilename(filename) {
    const newFilename = `dist/latest/${path.basename(filename)}`;
    return newFilename.replace(`-${this._version}`, '');
  }

  /**
   * @param {String} sourceFile
   * @param {String} destFile
   * @method _log
   */
  _log(sourceFile, destFile) {
    /* eslint-disable no-console */
    console.log(`[generate-latest] Copied ${sourceFile} to ${destFile}`);
    /* eslint-enable no-console */
  }

  /**
   * @method _generate
   * @private
   */
  _generate() {
    const self = this;
    const distFiles = fs.readdirSync('./dist/');
    distFiles.map((filename) => {
      if (filename.match(`jt-fw-${self._version}`) !== null) {
        const sourceFile = `./dist/${filename}`;
        const destFile = self._getNewFilename(filename);
        fs.writeFile(destFile, fs.readFileSync(sourceFile), (err) => {
          if (err) {
            throw err;
          }

          self._log(sourceFile, destFile);
        });
      }
    });
  }
}

export default GenerateLatest;
