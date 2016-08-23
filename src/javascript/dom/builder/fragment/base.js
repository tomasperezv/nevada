'use strict';

import FragmentBuilder from '../builder';
import { Factory } from '../factory';
import { fromEnvironment as LoggerLoader } from '../../../../coffeescript/logger.coffee';

class Base {
  /**
   * @param {Object} overrides
   * @param {String} type
   * @constructor
   */
  constructor(overrides, type) {
    this._options = {
      wrapper: '',
      data: {},
      locators: []
    };
    Object.assign(this._options, overrides);

    if (typeof overrides.data.fields === 'undefined' && typeof overrides.data.id !== 'undefined') {
      this._options.locators.push({
        selector: '.dom_builder_field',
        attributes: {
          'data-field-id': overrides.data.id
        }
      });
    }

    /**
     * @type {String} _type
     * @private
     */
    this._type = type;

    /**
     * @type {null|DocumentFragment}
     */
    this._fragment = null;

    /**
     * @type {Logger}
     */
    this._logger = LoggerLoader();
    this._logger.info(`Creating component ${this._type}`, this._options.data);
  }

  /**
   * @return {null|DocumentFragment}
   * @method getFragment
   */
  getFragment() {
    this._fragment = FragmentBuilder.get(this._type);

    const children = this._overrideChildren();
    if (children !== null) {
      this._options.data.fields = children;
    }

    this._renderLocators();
    this._decorate();
    return this._fragment;
  }

  /**
   * Intended to be overriden by children classes in order to draw custom children elements.
   * @method _overrideChildren
   * @private
   */
  _overrideChildren() {
    return null;
  }

  /**
   * @method _decorate
   * @private
   */
  _decorate() {
  }

  /**
   * @method _renderLocators
   */
  _renderLocators() {
    for (const locator of this._options.locators) {
      const element = this._fragment.querySelector(locator.selector);
      if (element !== null) {
        this._hydrateLocator(element, locator);
      }
    }
  }

  /**
   * @param {HTMLElement} element
   * @param {String} locator
   * @method _hydrateLocator
   */
  _hydrateLocator(element, locator) {
    if (locator.type === 'children') {
      this._renderChildren(element, locator);
    } else if (typeof locator.value !== 'undefined') {
      element.appendChild(document.createTextNode(locator.value));
    }

    if (typeof locator.attributes !== 'undefined') {
      this._hydrateLocatorAttributes(element, locator.attributes);
    }
  }

  /**
   * @param {HTMLElement} element
   * @param {Object} attributes
   * @method _hydrateLocatorAttributes
   */
  _hydrateLocatorAttributes(element, attributes) {
    for (const key of Object.keys(attributes)) {
      if (typeof attributes[key] !== 'undefined') {
        this._logger.info(`Setting attribute for ${this._type} ${key}=${attributes[key]}`);
        element.setAttribute(key, attributes[key]);
      }
    }
  }

  /**
   * @param {String} defaultType
   * @method _getChildrenType
   * @private
   */
  _getChildrenType(defaultType) {
    let type = defaultType;
    if (typeof this._options.children !== 'undefined') {
      type = this._options.children.type;
    }

    return type;
  }

  /**
   * @method _renderChild
   */
  _renderChild(element, type, data, fallback) {
    const child = Factory.create({
      type: this._getChildrenType(type),
      data: data,
      fallback: fallback
    });

    element.appendChild(child.getFragment());
  }

  /**
   */
  _renderChildrenList(element, children, locator) {
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (typeof child.type !== 'undefined') {
        this._renderChild(element, child.type, child, locator.fallback);
      } else if (this._options.collapseChildren) {
        this._renderChild(element, this._type, child, locator.fallback);
      } else {
        this._renderChildrenList(element, child.fields, locator);
      }
    }
  }

  /**
   * @param {HTMLElement} element
   * @param {String} locator
   * @method _renderChildren
   */
  _renderChildren(element, locator) {
    const children = this._options.data[locator.id];
    this._renderChildrenList(element, children, locator);
  }
}

export default Base;
