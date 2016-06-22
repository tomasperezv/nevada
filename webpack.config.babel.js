'use strict';
/**
 * This file contains the webpack configuration used to generate the
 * different bundle and development tools for the jt-frontend-framework.
 */
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import FlowStatusWebpackPlugin from 'flow-status-webpack-plugin';
import GenerateLatest from './builder/generate-latest';
import strip from './builder/webpack-strip-loader';
import environmentPlugin from './builder/production-environment';

import bundleName from './builder/bundle-name';
const outputBundle = bundleName.generate();

// Autoload the webpack plugins
import plugins from './builder/autoload-webpack-plugins';
plugins.push(new ExtractTextPlugin(outputBundle, { allChunks: true }));
plugins.push(new FlowStatusWebpackPlugin());
plugins.push(new GenerateLatest({ version: bundleName.getVersion() }));
plugins.push(environmentPlugin);

// Autoload javascript components
import rawComponents from './builder/autoload-components';
const components = rawComponents.map((current) => current.path);
components.push('./src/javascript/modulejs-core');
components.push('./src/javascript/emit-core-ready-event');
components.unshift('./src/core.js');

const config = {
  entry: {
    /**
     * CSS library
     */
    css: [
      './src/stylesheets/colors.less',
      './src/stylesheets/typography.less',
      './src/stylesheets/main.less'
    ],
    /**
     * Core Javascript library
     */
    'core.js': components,
    /**
     * Unit tests library
     */
    'unit.js': [
      './src/javascript/test-framework/core.js'
    ],
    /**
     * Tests runner bundle
     */
    'test-runner.js': [
      './test/javascript/test-framework/test.mock',
      './test/javascript/test-framework/test.dom-observer',
      './test/javascript/test-framework/test.modulejs',
      './test/javascript/test-framework/test.spy',
      './test/javascript/test.logger',
      './test/javascript/test.event-bus',
      './test/javascript/component/base/test.base-controller',
      './test/javascript/component/base/test.base-controller-view',
      './test/javascript/component/base/test.event-actions',
      './test/javascript/test.cookie-storage',
      './test/javascript/test.emit-core-ready-event',
      './test/javascript/test.clone-object',
      './test/javascript/polyfill/test.polyfill'
    ]
  },
  output: {
    filename: outputBundle
  },
  module: {
    preLoaders: [{
      test: /jquery[\\\/]src[\\\/]selector-sizzle\.js$/,
      loader: 'string-replace',
      query: {
        search: '../external/sizzle/dist/sizzle',
        replace: 'sizzle'
      }
    }],
    loaders: [
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract(
          'style-loader',
          'css-loader!postcss-loader!less-loader'
        )
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'flow'],
          plugins: [
            'transform-class-properties',
            ['transform-es2015-classes', { loose: true }]
          ],
          cacheDirectory: true
        }
      },
      {
        test: /\.coffee$/,
        loader: 'coffee'
      },
      {
        test: /modulejs-core\.js$/,
        loader: 'webpack-append',
        query: rawComponents.map((dep) =>
          `ModuleJS.define("${dep.name}", () => { const dep = require("../../${dep.path}");
           return dep.default ? dep.default : dep; });`
        ).join('')
      },
      {
        test: /\.(png|jpg|jpeg|gif|woff)$/,
        loader: 'url-loader'
      }
    ]
  },
  devtool: 'source-map',
  resolve: {
    unsafeCache: true
  },
  postcss() {
    return [autoprefixer, cssnano];
  },
  plugins
};

strip(config.module.loaders);

module.exports = config;
