'use strict';

import Base from './base';

class ButtonList extends Base {
  /**
   * @param {Object} options
   * @param {String} type
   * @constructor
   */
  constructor(options, type) {
    options.locators = [ // eslint-disable-line no-param-reassign
      {
        selector: '.data_collection_button_list',
        type: 'children',
        id: 'options'
      },
      {
        selector: '.dynamic_form_title',
        value: options.data.title
      },
      {
        selector: '.dynamic_form_description',
        value: options.data.description
      }];

    super(options, type);

    this._element = document.querySelector(options.wrapper);
    this.render();
  }

  render() {
    if (this._element !== null) {
      const fragment = this.getFragment();
      this._element.appendChild(fragment);
    }
  }

}

export default ButtonList;
