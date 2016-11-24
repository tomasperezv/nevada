/* @flow */
'use strict';

/**
 * Encapsulates utilities for DOM elements and events handling, intended to used
 * by test cases.
 * @module DOMUtil
 */
class DOMUtil {
  /**
   * @method _generateEvent
   * @param {String} type
   * @private
   */
  _generateEventObject(type: string): Event {
    return new Event(type, {
      view: window,
      bubbles: true,
      cancelable: true
    });
  }

  /**
   * @method sendClickEvent
   * @param {String} id
   * @public
   */
  sendClickEvent(id: string) {
    const clickEvent = this._generateEventObject('click');
    document.getElementById(id).dispatchEvent(clickEvent);
  }

  /**
   * @method sendResizeEvent
   * @public
   */
  sendResizeEvent() {
    const resizeEvent = this._generateEventObject('resize');
    document.dispatchEvent(resizeEvent);
  }

  /**
   * @method sendDOMContentLoadedEvent
   * @public
   */
  sendDOMContentLoadedEvent() {
    const domContentLoadedEvent = this._generateEventObject('DOMContentLoaded');
    document.dispatchEvent(domContentLoadedEvent);
  }
}

export default new DOMUtil();
