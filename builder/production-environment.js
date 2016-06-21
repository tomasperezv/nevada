'use strict';
import webpack from 'webpack';

/**
 * Configures the enviroment
 * @see https://webpack.github.io/docs/list-of-plugins.html
 */

const env = process.env.NODE_ENV === 'production' ? '"production"' : '"development"';

module.exports = new webpack.DefinePlugin({
  'process.env.NODE_ENV': env
});
