'use strict';

import Base from './base';
import Type from '../type';

class File extends Base {
  /**
   * @param {Object} options
   * @param {String} type
   * @constructor
   */
  constructor(options, type) {
    options.locators = [ // eslint-disable-line no-param-reassign
      {
        selector: '.dynamic_form_title',
        value: options.data.title
      },
      {
        selector: '.dynamic_form_description',
        value: options.data.description
      },
      {
        selector: '.dynamic_form_input',
        attributes: {
          name: options.data.key,
          value: options.data.value
        }
      }
    ];

    if (options.data.type_hint === 'image-url') {
      options.locators.push({
        selector: '.dynamic_form_image_preview',
        attributes: {
          src: options.data.value
        }
      });
    }

    super(options, type);
  }
}

export default File;
