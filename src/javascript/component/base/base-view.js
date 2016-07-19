/* @flow */
'use strict';

import EventActions from './event-actions';
import Environment from '../../environment';

/**
 * The base class for views
 * @module BaseView
 */
class BaseView {
  locators: Object;
  _controller: Object|null;
  _id: string;
  _template: string|null;
  $: Function;

  /**
   * @constructor
   */
  constructor(options: Object = {}): void {
    if (typeof this.locators === 'undefined'){
      this.locators = options.locators || {};
    }
    this.locators.main = options.locator || null;
    this._controller = options.controller || null;
    this.$ = require('../../dom/core');

    this._loadTemplate();
    this._attachEvents();
  }

  /**
   * Autoloads the template in the development environment.
   *
   * @method _loadTemplate
   * @private
   */
  _loadTemplate(): void {
    if (Environment.isDevelopment()) {
      if (this._template !== null) {
        this.$(this.locators.main).replaceWith(this._template);
      }
    }
  }

  /**
   * @method _attachEvents
   * @private
   */
  _attachEvents(): void {
    const eventActions = new EventActions();
    eventActions.augment(this);
  }

  /**
   * @method render
   * @public
   */
  render(): void {
  }

  /**
   * @method
   * @param {String} state
   */
  _notifyParentOfStateChange(state: string): void {
    if (this._controller !== null) {
      this._controller.onStateChange(state);
    }
  }
}

export default BaseView;
