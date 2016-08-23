'use strict';

import Base from './base';
import Type from '../type';

class Enum extends Base {
  /**
   * @param {Object} options
   * @param {String} type
   * @constructor
   */
  constructor(options = {}, type) {
    options.locators = [ // eslint-disable-line no-param-reassign
    {
      selector: 'select',
      type: 'children',
      id: 'fields'
    },
   {
     selector: '.dynamic_form_title',
     value: options.data.title
   },
   {
     selector: '.dynamic_form_hint',
     value: options.data.description
   }];

    if (options.data.type_hint === 'combo') {
      options.locators[0].selector = '.dynamic_form_field_combo_enum';
      type = Type.ComboEnum;
    }

    super(options, type);
  }

  /**
   * We need to parse the data in order to generate the options taken from `enum_values`
   * @param {Object} enumValues
   * @returns {Object|null}
   * @constructor
   */
  _overrideChildren() {
    // Transform data in order to render option elements
    const enumValues = this._options.data.enum_values;
    const children = [];
    const type = this._identifyChildrenType(this._options.data.type_hint);
    for (let optionKey in enumValues) {
      children.push({
        parentName: this._options.data.key,
        type: type,
        id: this._options.data.id,
        value: optionKey,
        title: enumValues[optionKey],
        selected: this._options.data.value === enumValues[optionKey] ? true : false
      });
    }

    return children;
  }

  /**
   * @returns {String}
   * @method _identifyChildrenType
   * @private
   */
  _identifyChildrenType(hint) {
    let type = Type.EnumOption;
    if (hint === 'combo') {
      type = Type.ComboEnumOption
    }

    return type;
  }
}

export default Enum;
