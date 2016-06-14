'use strict';

/**
 * This module autoloads the plugin initializers placed in the 'plugin-initializer' folder,
 * and generates them as an array that will be used in order to compose the webpack config.
 * @module autoloadWebpackPlugins
 */
import fs from 'fs';
const pluginFiles = fs.readdirSync('./builder/plugin-initializer');
let plugins = [];
pluginFiles.forEach((currentPluginFile) => {
  const subplugins = require(`./plugin-initializer/${currentPluginFile}`);
  if (Array.isArray(subplugins)) {
    // The result is an array of subplugins, we need to merge them
    // using spread.
    plugins = [...plugins, ...subplugins];
  } else {
    plugins.push(subplugins);
  }
});

module.exports = plugins;
