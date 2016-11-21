/* @flow */
'use strict';

import BaseController from '../../javascript/component/base/base-controller';
import CookieStorage from '../../javascript/cookie-storage';

class TooltipController extends BaseController {
  constructor(options: Object = {}) {
    options.id = 'Tooltip'; // eslint-disable-line no-param-reassign
    super(options);
    this._once = this._options.once || false;
    this._cookieId = this._options.locator;
  }

  show(): void {
    if (this._once) {
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

  close(): void {
    this._store.dispatch({ type: 'close' });
    this._eventBus.publish(`close${this._id}`, { locator: this._options.locator });
  }
}

export default TooltipController;
