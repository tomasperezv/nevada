'use strict';

import Base from './base';

class Button extends Base {
  /**
   * @param {Object} options
   * @param {String} type
   * @constructor
   */
  constructor(options, type) {
    options.locators = [ // eslint-disable-line no-param-reassign
      {
        selector: '.data_collection_button',
        value: options.data.title,
        attributes: {
          'data-value': options.data.value
        }
      }
    ];

    super(options, type);
  }
}

export default Button;
