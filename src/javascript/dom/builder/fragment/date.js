'use strict';

import Base from './base';

class DateField extends Base {
  /**
   * @param {Object} options
   * @param {String} type
   * @constructor
   */
  constructor(options, type) {
    options.locators = [ // eslint-disable-line no-param-reassign
      {
       selector: '.dom_builder_field',
       attributes: {
         value: options.data.value
       }
      },
      {
        selector: '.dynamic_form_title',
        value: options.data.title
      },
      {
        selector: '.dynamic_form_hint',
        value: options.data.description
      }
    ];

    super(options, type);
  }
}

export default DateField;
