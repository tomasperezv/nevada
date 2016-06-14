'use strict';

import path from 'path';

/**
 * @param {String} filename
 * @param {String} path
 * @module ModuleJSResolveName
 */
module.exports = (filename) => {
  const moduleName = path.parse(filename).name;
  const parts = moduleName.split('-');
  return parts.map((current) => current[0].toUpperCase() + current.substring(1)).join('');
};
