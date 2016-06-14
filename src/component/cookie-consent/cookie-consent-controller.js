/* @flow */
'use strict';

import BaseController from '../../javascript/component/base/base-controller';
import CookieStorage from '../../javascript/cookie-storage';

class CookieConsentController extends BaseController {
  _cookieId: string;

  constructor(options: Object = {}) {
    options.id = 'CookieConsent'; // eslint-disable-line no-param-reassign
    super(options);

    this._cookieId = 'cookie_consent';
    if (CookieStorage.get(this._cookieId) !== 'yes') {
      this._store.dispatch({ type: 'show' });
    }
  }

  onStateChange(state:string): void {
    super.onStateChange(state);
    if (state === 'close') {
      CookieStorage.set(this._cookieId, 'yes', { expires: 9999 });
    }
  }
}

export default CookieConsentController;
