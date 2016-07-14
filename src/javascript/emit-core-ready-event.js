'use strict';
/**
 * When the core bundle is loaded we want to emit an event through the window object,
 * in order to let listener to subscribe to it.
 *
 * ```javascript
 * window.addEventListener('jt-core-ready', () => {
 *  // Now core is loaded, and I can use modulejs, Modulejs, etc.
 *  ...
 * });
 * ```
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
 */
if (typeof window !== 'undefined') {
  const eventName = 'jt-core-loaded';
  if (typeof document.createEvent !== 'undefined') {
    try {
      // Expose the jt-core-loaded through the window object
      const event = new CustomEvent('jt-core-loaded');
      window.dispatchEvent(event);
    } catch (e) {
      // Fallback
      const $ = require('./dom/core');
      $(window).trigger(eventName);
    }
  }
}
