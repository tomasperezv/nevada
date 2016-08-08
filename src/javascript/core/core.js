'use strict';

/**
 * Nevada's default bundle including polyfills and DOM access layer.
 * @module core framework
 */

// Polyfills: <=IE8
require('html5shiv');
require('../polyfill/add-event-listener');
require('../polyfill/custom-event');

// Define the environment depending on NODE_ENV
const Environment = require('../environment').default;
Environment.environment = process.env.NODE_ENV;

// DOM Library
window.jQuery = window.$ = require('../dom/core');
