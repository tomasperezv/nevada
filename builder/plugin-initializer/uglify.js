'use strict';
import webpack from 'webpack';

/**
 * Configures the UglifyJsPlugin
 * @see https://webpack.github.io/docs/list-of-plugins.html
 * @module HtmlWebpack
 */

const plugin = [];

if (process.env.NODE_ENV === 'production') {
  plugin.push(new webpack.optimize.UglifyJsPlugin({
    compressor: {
      warnings: false
    }
  }));
}

module.exports = plugin;
