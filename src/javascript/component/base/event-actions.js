/* @flow */
/* global EventListener */
'use strict';

import BaseControllerView from './base-controller-view';
import { ElementEvents, DocumentEvents } from './event';

/**
 * In charge of extending view objects with dynamic event handlers.
 * @module EventActions
 */
class EventActions {
  _eventListenerPrefix: string;
  _eventMap: Map<string, EventListener>;

  /**
   * @constructor
   */
  constructor(): void {
    this._eventListenerPrefix = 'on';
    this._eventMap = new Map();
  }

  /**
   * @param {BaseControllerView} target
   * @method augment
   * @public
   */
  augment(target: BaseControllerView): void {
    if (typeof document !== 'undefined') {
      const attachCallback = (options) => {
        // $FlowFixMe: Property not found
        this._attachEventListener(options.element, options.eventName, (event) => {
          options.eventHandler(event);
          target._notifyParentOfStateChange(options.locatorName);
          if (options.preventDefault) {
            /* eslint-disable no-unused-expressions, no-param-reassign */
            event.preventDefault ? event.preventDefault() : (event.returnValue = false);
            /* eslint-enable no-unused-expressions, no-param-reassign */
          }
        });
      };

      this._genericEventProcess(target, attachCallback);
    }
  }

  /**
   * @param {BaseControllerView} target
   * @method clear
   * @public
   */
  clear(target: BaseControllerView): void {
    const detachCallback = (options) => {
      this._detachEventListener(options.element, options.eventName, options.eventHandler);
    };

    this._genericEventProcess(target, detachCallback);
  }

  /**
   * @param {BaseControllerView} target
   * @param {Function} callback
   * @method _genericEventProcess
   * @private
   */
  _genericEventProcess(target: BaseControllerView, callback: Function) {
    this._augmentTargetBasedOnEventTypes(target, ElementEvents, target.locators, callback);
    this._augmentTargetBasedOnEventTypes(target, DocumentEvents, { Document: document }, callback);
  }

  /**
   * @method _augmentTargetBasedOnEventTypes
   * @private
   */
  _augmentTargetBasedOnEventTypes(target: BaseControllerView, events: Array<string>, locators: Object,
    callback: Function): void {
    for (let i = 0; i < events.length; i++) {
      const eventName = events[i];
      for (const locatorName in locators) { // eslint-disable-line guard-for-in
        const locator = locators[locatorName];
        const locatorAsString = this._getLocatorString(locator);
        let eventListenerName = this._getEventListenerName(eventName, locatorName);
        let element;
        if (locator === document) {
          element = document;
          eventListenerName = eventListenerName.replace('Document', '');
        } else {
          // TODO: Replace this by the proper DOM access polyfill
          element = document.querySelector(locatorAsString);
        }

        let preventDefault = true;
        if (locator !== null && typeof locator === 'object' &&
            typeof locator.__set__ === 'undefined') {
          // Views can avoid having to define the listeners methods by using object locators,
          // that way we support passing simple state changes view -> controller -> dispatcher -> view
          /* eslint-disable no-param-reassign */
          if (typeof locator.handler === 'function') {
            // $FlowFixMe: Review Indexable property not found
            target[eventListenerName] = locator.handler;
          } else {
            // Empty event handler for simple message passing
            // $FlowFixMe: Review Indexable property not found
            target[eventListenerName] = () => {};
          }
          /* eslint-enable no-param-reassign */

          locator.__set__ = true;
          preventDefault = locator.preventDefault || true;
        }

        // $FlowFixMe: Indexable signature not found
        if (typeof target[eventListenerName] === 'function') {
          callback({
            element,
            eventName,
            eventListenerName,
            eventHandler: target[eventListenerName].bind(target),
            locatorName,
            preventDefault
          });
        }
      }
    }
  }

  /**
   * @param {Object|string} locator
   * @returns {String}
   * @method _getLocatorString
   */
  _getLocatorString(locator: Object|string): string {
    return (typeof locator === 'object' && locator !== null ? locator.id : locator);
  }

  /**
   * @method _getEventListenerName
   * @returns {String}
   * @private
   */
  _getEventListenerName(eventName: string, locator: string): string {
    const upperFirstChar = (str) => `${str[0].toUpperCase()}${str.substring(1)}`;

    let eventListenerName = this._eventListenerPrefix;
    eventListenerName += upperFirstChar(locator);
    eventListenerName += upperFirstChar(eventName);
    return eventListenerName;
  }

  /**
   * @method _attachEventListener
   * @param {Node} element
   * @param {String} eventName
   * @param {Function} callback
   * @private
   */
  _attachEventListener(element: Node, eventName: string, callback: EventListener): void {
    if (element !== null) {
      element.addEventListener(eventName, callback, false);
      this._eventMap.set(eventName, callback);
    }
  }

  /**
   * @method _detachEventListener
   * @param {Node} element
   * @param {String} eventName
   * @param {Function} callback
   * @private
   */
  _detachEventListener(element: Node, eventName: string): void {
    const eventHandler = this._eventMap.get(eventName);
    if (element !== null && typeof eventHandler !== 'undefined') {
      element.removeEventListener(eventName, eventHandler, false);
      this._eventMap.delete(eventName);
    }
  }

}

export default EventActions;
