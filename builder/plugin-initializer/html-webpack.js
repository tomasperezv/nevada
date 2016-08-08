'use strict';

import HtmlWebpackPlugin from 'html-webpack-plugin';
import bundleName from '../bundle/bundle-name';

/**
 * Mapper in order to abstract the HtmlWebpackPlugin initialization
 * @type {Object} templateDefinition
 */
const templateDefinitions = [
  {
    filename: './dist/index.html',
    template: 'src/html/sandbox/index.html',
    exclude: ['test-runner.js', 'css', 'unit.js']
  },
  {
    filename: './dist/css.html',
    template: 'src/html/sandbox/css.html',
    exclude: ['test-runner.js', 'css', 'unit.js']
  },
  {
    filename: './dist/js-unit-tests.html',
    template: 'src/html/sandbox/js-unit-tests.html',
    exclude: ['css', 'unit.js', 'core.js', 'test-runner.js']
  }
];

/**
 * Defines the templates that we want to process with the html webpack plugin.
 * @see https://www.npmjs.com/package/html-webpack-plugin
 * @module HtmlWebpack
 */
module.exports = templateDefinitions.map((def) => new HtmlWebpackPlugin({
  filename: def.filename,
  template: def.template,
  excludeChunks: def.exclude,
  version: bundleName.getVersion()
}));
