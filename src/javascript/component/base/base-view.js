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
  _eventActions: EventActions;
  $: Function;

  /**
   * @constructor
   */
  constructor(options: Object = {}): void {
    if (typeof this.locators === 'undefined'){
      this.locators = options.locators || {};
    }

    if (typeof options.attachEvents === 'undefined') {
      options.attachEvents = true; // eslint-disable-line no-param-reassign
    }

    Object.assign(this.locators, options.locators);

    this.locators.main = options.locator || null;
    this._controller = options.controller || null;
    this.$ = require('../../dom/core');

    this._loadTemplate();

    if (options.attachEvents) {
      this._attachEvents();
    }
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
    this._eventActions = new EventActions();
    this._eventActions.augment(this);
  }

  /**
   * @method clearEvents
   * @public
   */
  clearEvents(): void {
    this._eventActions.clear(this);
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
