'use strict';

/**
 * Nevada's lightweight bundle.
 * @module core framework
 */

// Define the environment depending on NODE_ENV
const Environment = require('../environment').default;
Environment.version = Environment.NEVADA_LIGHTWEIGHT;
