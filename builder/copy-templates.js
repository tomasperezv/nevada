'use strict';
import path from 'path';
import fs from 'fs';

/**
 * Webpack plugin for copying erb templates to the distribution folder
 * @see https://webpack.github.io/docs/plugins.html
 * @module CopyTemplates
 */
class CopyTemplates {
  /**
   * @param {Object} compiler
   * @method apply
   * @public
   */
  apply(compiler) {
    const self = this;
    compiler.plugin('done', () => {
      self._copyTemplates();
    });
  }

  /**
   * @param {String} sourceFile
   * @param {String} destFile
   * @method _log
   */
  _log(sourceFile, destFile) {
    /* eslint-disable no-console */
    console.log(`[copy-templates] Copied ${sourceFile} to ${destFile}`);
    /* eslint-enable no-console */
  }

  /**
   * @param {String} componentPath
   * @param {String} id
   * @method _processComponent
   * @private
   */
  _processComponent(componentPath, id) {
    const self = this;
    const distPath = './dist/template/';

    const files = fs.readdirSync(componentPath);
    files.forEach((template) => {
      if (template.match(/\.html$/)) {
        const basename = path.basename(template);
        const destination = `${distPath}/${id}/_${basename}.erb`;
        const source = `${componentPath}/${template}`;

        try {
          fs.statSync(`${distPath}/${id}`);
        } catch (e) {
          fs.mkdirSync(`${distPath}/${id}`);
        }

        fs.writeFile(destination, fs.readFileSync(source), (err) => {
          if (err) {
            throw err;
          }

          self._log(source, destination);
        });
      }
    });
  }

  /**
   * @method _copyTemplates
   * @private
   */
  _copyTemplates() {
    const self = this;
    const basePath = './src/component';
    const components = fs.readdirSync(basePath);
    components.forEach((filename) => {
      if (fs.statSync(`${basePath}/${filename}`).isDirectory()) {
        self._processComponent(`${basePath}/${filename}`, filename);
      }
    });
  }
}

export default CopyTemplates;
