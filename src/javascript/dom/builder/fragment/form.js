'use strict';

import Base from './base';

class Form extends Base {
  /**
   * @param {Object} options
   * @param {String} type
   * @constructor
   */
  constructor(options = {}, type) {
    options.locators = [ // eslint-disable-line no-param-reassign
    {
      selector: '.dynamic_form_title',
      value: options.data.title
    },
    {
      selector: '.dynamic_form_description',
      value: options.data.description
    }];

    // Extend the object locators with the decorators extra data attributes
    options.locators = options.locators.concat(options.decorators);
    super(options, type);

    this._element = document.querySelector(options.wrapper);
    this.render();
  }

  /**
   * @method render
   */
  render() {
    if (this._element !== null) {
      const fragment = this.getFragment();
      this._element.appendChild(fragment);
    }
  }
}

export default Form;
