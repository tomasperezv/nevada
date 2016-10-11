'use strict';

/**
 * Nevada's lightweight bundle.
 * @module core framework
 */

// Define the environment depending on NODE_ENV
const Environment = require('../environment').default;
require('core-js/modules/es6.date.now');
require('core-js/modules/es6.symbol');
require('core-js/es6/object');
require('core-js/es6/map');
Environment.version = Environment.NEVADA_LIGHTWEIGHT;
