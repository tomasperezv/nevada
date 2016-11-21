/* @flow */
'use strict';

import BaseController from '../../javascript/component/base/base-controller';
import CookieStorage from '../../javascript/cookie-storage';

class TooltipController extends BaseController {
  _cookieId: string;
  _showOnce: boolean;

  /**
   * @param {Object} options
   * @constructor
   */
  constructor(options: Object = {}) {
    options.id = 'Tooltip'; // eslint-disable-line no-param-reassign
    super(options);
    this._showOnce = this._options.showOnce || false;
    this._cookieId = this._options.locator;
  }

  /**
   * @method show
   * @public
   */
  show(): void {
    if (this._showOnce) {
      if (CookieStorage.get(this._cookieId) !== 'yes') {
        CookieStorage.set(this._cookieId, 'yes', { expires: 9999 });
        this._store.dispatch({ type: 'show' });
        this._eventBus.publish(`show${this._id}`, { locator: this._options.locator });
      }
    } else {
      this._store.dispatch({ type: 'show' });
      this._eventBus.publish(`show${this._id}`, { locator: this._options.locator });
    }
  }

  /**
   * @method close
   * @public
   */
  close(): void {
    this._store.dispatch({ type: 'close' });
    this._eventBus.publish(`close${this._id}`, { locator: this._options.locator });
  }
}

export default TooltipController;
