'use strict';

import Base from './base';
import Type from '../type';

class String extends Base {
  /**
   * @param {Object} options
   * @param {String} type
   * @constructor
   */
  constructor(options, type) {
    options.locators = [ // eslint-disable-line no-param-reassign
      {
       selector: '.dynamic_form',
       type: 'children',
       id: 'fields',
      },
      {
        selector: '.dynamic_form_title',
        value: options.data.title
      },
      {
        selector: '.dynamic_form_description',
        value: options.data.description
      },
      {
        selector: '.dynamic_form_hint',
        value: options.data.hint
      },
      {
        selector: '.dynamic_form_extra_hint',
        value: options.data.extraHint
      },
      {
        selector: '.dynamic_form_input',
        attributes: {
          placeholder: options.data.placeholder,
          name: options.data.key,
          value: options.data.value
        }
      }
    ];

    super(options, type);
  }
}

export default String;
