'use strict';

import Base from './base';

class EnumOption extends Base {
  /**
   * @param {Object} options
   * @param {String} type
   * @constructor
   */
  constructor(options, type) {
    options.locators = [ // eslint-disable-line no-param-reassign
      {
        selector: 'option',
        value: options.data.title,
        attributes: {
         value: options.data.value
        }
      }
    ];

    if (options.data.selected) {
      options.locators[0].attributes.selected = '';
    }

    super(options, type);
  }
}

export default EnumOption;
