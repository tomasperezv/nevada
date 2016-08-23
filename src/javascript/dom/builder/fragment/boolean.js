'use strict';

import Base from './base';

class Boolean extends Base {
  /**
   * @param {Object} options
   * @param {String} type
   * @constructor
   */
  constructor(options, type) {
    options.locators = [ // eslint-disable-line no-param-reassign
      {
        selector: '.dynamic_form_label',
        value: options.data.description
      },
      {
        selector: '.dynamic_form_hint',
        value: options.data.title
      },
      {
        selector: 'input[name="hidden-boolean-value"]',
        attributes: {
          'value': options.data.value
        }
      }
    ];

    super(options, type);
  }
}

export default Boolean;
