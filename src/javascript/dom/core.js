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
  require('jquery/src/core/parseHTML');
  require('jquery/src/css');
  require('jquery/src/css/hiddenVisibleSelectors');
  require('jquery/src/attributes');
  require('jquery/src/data');
  require('jquery/src/dimensions');
  require('jquery/src/offset');
  require('jquery/src/effects');
  require('jquery/src/deprecated');
  require('jquery/src/event');
  require('jquery/src/event/alias');
  require('jquery/src/ajax');
  require('jquery/src/ajax/script');
  require('jquery/src/ajax/xhr');
  require('jquery/src/wrap');
  require('jquery/src/serialize');
  require('jquery/src/queue/delay');
}

module.exports = $;
