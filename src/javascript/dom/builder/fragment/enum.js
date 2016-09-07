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
      selector: '.dom_builder_field',
      attributes: {
        name: options.data.key
      }
    },
    {
      selector: '.dynamic_form_hint',
      value: options.data.hint
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
    const type = this._identifyChildrenType(this._options.data.type_hint);
    const self = this;

    return enumValues.map((current) => {
      return {
        parentName: self._options.data.key,
        type,
        id: self._options.data.id,
        value: current.key,
        title: current.value,
        selected: self._options.data.value === current.value
      };
    });
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
