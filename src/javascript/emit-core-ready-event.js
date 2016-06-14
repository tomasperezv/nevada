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
  // Expose the jt-core-loaded through the window object
  // TODO: only functional for modern browsers
  if (typeof document.createEvent !== 'undefined') {
    const event = new CustomEvent('jt-core-loaded');
    window.dispatchEvent(event);
  }
}
