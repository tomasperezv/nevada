'use strict';

import webpackStrip from 'webpack-strip';

module.exports = exports = function(loaders){
  if (process.env.NODE_ENV === 'production') {
    const test = {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: webpackStrip.loader('console.log', 'console.error')
    };
    loaders.push(test);
  }
};
