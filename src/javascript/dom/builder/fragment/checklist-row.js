'use strict';

import Base from './base';

class ChecklistRow extends Base {
  /**
   * @param {Object} options
   * @param {String} type
   * @constructor
   */
  constructor(options, type) {
    options.locators = [ // eslint-disable-line no-param-reassign
      {
        selector: '.data_collection_checklist_element_field',
        value: options.data.title
      },
      {
        selector: '.data_collection_checklist_element_content',
        value: options.data.preview
      },
      {
        selector: '.dynamic_form_field',
        attributes: {
          'data-id': options.data.id
        }
      }
    ];

    super(options, type);
  }

  /**
   * @method _decorate
   * @private
   */
  _decorate() {
    this._options.decorators.map((decorator) => {
      const element = this._fragment.querySelector(decorator.selector);
      if (element !== null) {
        decorator.handler(element, this._options.data);
      }
    });
  }
}

export default ChecklistRow;
