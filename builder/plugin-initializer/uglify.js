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
    mangle: false,
    compress: {
      warnings: false,
      screw_ie8: true,
      sequences: true,
      properties: true,
      dead_code: true,
      drop_debugger: true,
      comparisons: true,
      conditionals: true,
      evaluate: true,
      booleans: true,
      loops: true,
      unused: true,
      hoist_funs: true,
      if_return: true,
      join_vars: true,
      cascade: true,
      negate_iife: true,
      drop_console: true
    }
  }));
}

module.exports = plugin;
