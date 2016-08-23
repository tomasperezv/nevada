'use strict';

import Base from './base';

class ComboEnumOption extends Base {
  /**
   * @param {Object} options
   * @param {String} type
   * @constructor
   */
  constructor(options, type) {
    options.locators = [ // eslint-disable-line no-param-reassign
      {
        selector: 'input[type="radio"]',
        attributes: {
         value: options.data.value,
         name: options.data.parentName
        }
      },
      {
        selector: 'label',
        value: options.data.title
      }
    ];

    if (options.data.selected) {
      options.locators[0].attributes.checked = '';
    }

    super(options, type);
  }
}

export default ComboEnumOption;
