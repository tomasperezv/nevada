'use strict';

import Base from './base';
import Type from '../type';

class SimpleButton extends Base {
  /**
   * @param {Object} options
   * @param {String} type
   * @constructor
   */
  constructor(options, type) {
    options.locators = [ // eslint-disable-line no-param-reassign
      {
        selector: '.data_collection_ok_button',
        value: options.data.text
      },
      {
        selector: '.data_collection_ok_button_text',
        value: options.data.description
      }
    ];

    super(options, type);
  }
}

export default SimpleButton;
