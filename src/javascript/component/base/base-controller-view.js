/* @flow */
'use strict';

import EventActions from './event-actions';

/**
 * The base class for views
 * @module BaseControllerView
 */
class BaseControllerView {
  locators: Object;
  _controller: Object|null;
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
    this._attachEvents();
    this.$ = require('../../dom/core');
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

export default BaseControllerView;
