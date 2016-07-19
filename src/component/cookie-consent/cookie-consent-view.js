/* @flow */
'use strict';

import BaseView from '../../javascript/component/base/base-view';
// $FlowFixMe
import '!style!css!less!./main.less';

class CookieConsentView extends BaseView {
  _element: Object;

  constructor(options: Object) {
    options.locators = { // eslint-disable-line no-param-reassign
      close: {
        id: '#close_cookies_box',
        event: 'click',
        preventDefault: false
      }
    };
    super(options);

    this._element = this.$(this.locators.main);
  }

  show(): void {
    this._element.show();
  }

  close(): void {
    this._element.fadeOut();
  }
}

export default CookieConsentView;
