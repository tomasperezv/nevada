'use strict';
/**
 * Encapsulates the DOM access layer
 * @module DomCore
 */

// Fallback
let $ = () => {};
if (!process || process.env.NODE_ENV !== 'test') {
  $ = require('jquery/src/core');
  require('jquery/src/core/init');
  require('jquery/src/css');
  require('jquery/src/attributes');
  require('jquery/src/data');
  require('jquery/src/dimensions');
  require('jquery/src/offset');
  require('jquery/src/effects');
  require('jquery/src/deprecated');
  require('jquery/src/event');
}

module.exports = $;
