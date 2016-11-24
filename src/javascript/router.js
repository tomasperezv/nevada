/* @flow */
'use strict';

/**
 * @module Router
 */
class Router {
  /**
   * @constructor
   */
  constructor() {
    this._init();
    this._events = {};
  }

  /**
   * @returns {Object}
   * @method _getUrlParams
   * @private
   */
  _getUrlParams(): Object {
    let qs = document.location.search;
    qs = qs.split('+').join(' ');

    const params = {};
    const re = /[?&]?([^=]+)=([^&]*)/g;
    let tokens;

    while (tokens = re.exec(qs)) { // eslint-disable-line no-cond-assign
      params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
  }

  /**
   * @method _init
   * @private
   */
  _init(): void {
    const self = this;

    document.addEventListener('DOMContentLoaded', () => {
      const params = self._getUrlParams();
      if (typeof self._events.navigation !== 'undefined') {
        const listeners = self._events.navigation;
        listeners.map((listener) => {
          listener(params);
        });
      }
    });
  }

  /**
   * @param {String} eventId
   * @param {Function} listener
   * @method on
   * @public
   */
  on(eventId, listener): void {
    if (typeof this._events[eventId] === 'undefined') {
      this._events[eventId] = [];
    }

    this._events[eventId].push(listener);
  }
}

const router = new Router();

export default router;
