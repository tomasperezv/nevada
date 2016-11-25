/* @flow */
/* global EventListener */
'use strict';

import BaseView from './base-view';
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
   * @param {BaseView} target
   * @method augment
   * @public
   */
  augment(target: BaseView): void {
    if (typeof document !== 'undefined') {
      const attachCallback = (options) => {
        // $FlowFixMe: Property not found
        this._attachEventListener(options.element, options.eventName, (event) => {
          options.eventHandler(event);
          target._notifyParentOfStateChange(options.locatorName);
          if (options.preventDefault) {
            /* eslint-disable no-unused-expressions, no-param-reassign */
            if (event.preventDefault) {
              event.preventDefault();
              event.stopPropagation();
            } else {
              event.returnValue = false;
            }
            /* eslint-enable no-unused-expressions, no-param-reassign */
          }
        }, options.eventListenerName);
      };

      this._genericEventProcess(target, attachCallback);
    }
  }

  /**
   * @param {BaseView} target
   * @method clear
   * @public
   */
  clear(target: BaseView): void {
    const detachCallback = (options) => {
      this._detachEventListener(options.element, options.eventName, options.eventListenerName);
    };

    this._genericEventProcess(target, detachCallback);
  }

  /**
   * @param {BaseView} target
   * @param {Function} callback
   * @method _genericEventProcess
   * @private
   */
  _genericEventProcess(target: BaseView, callback: Function) {
    this._augmentTargetBasedOnEventTypes(target, ElementEvents, target.locators, callback);
    this._augmentTargetBasedOnEventTypes(target, DocumentEvents, { Document: document }, callback);
  }

  /**
   * @method _augmentTargetBasedOnEventTypes
   * @private
   */
  _augmentTargetBasedOnEventTypes(target: BaseView, events: Array<string>, locators: Object,
    callback: Function): void {
    for (let i = 0; i < events.length; i++) {
      const eventName = events[i];
      for (const locatorName in locators) { // eslint-disable-line guard-for-in
        const locator = locators[locatorName];
        let eventListenerName = this._getEventListenerName(eventName, locatorName);
        let element;

        if (locator === document || locator.id === document) {
          element = document;
          eventListenerName = eventListenerName.replace('Document', '');
        } else {
          let locatorAsString = this._getLocatorString(locator);
          if (typeof locatorAsString !== 'undefined') {
            if (typeof locators.wrapper !== 'undefined') {
              locatorAsString = `${locators.wrapper} ${locatorAsString}`;
            }

            element = document.querySelector(locatorAsString);
          }
        }

        const preventDefault = this._getPreventDefault(locator);

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
   * @returns {Boolean}
   * @method _getPreventDefault
   * @private
   */
  _getPreventDefault(locator: Object|string): boolean {
    let preventDefault = false;

    if (locator !== document && locator.id !== document) {
      preventDefault = typeof locator.preventDefault !== 'undefined' ? locator.preventDefault : true;
    }

    return preventDefault;
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
   * @param {String} listenerName
   * @private
   */
  _attachEventListener(element: Node, eventName: string, callback: EventListener,
    listenerName: string): void {
    if (element !== null && typeof element !== 'undefined') {
      element.addEventListener(eventName, callback, false);
      this._eventMap.set(listenerName, callback);
    }
  }

  /**
   * @method _detachEventListener
   * @param {Node} element
   * @param {String} eventName
   * @param {String} listenerName
   * @private
   */
  _detachEventListener(element: Node, eventName: string, listenerName: string): void {
    const eventHandler = this._eventMap.get(listenerName);
    if (element !== null && typeof eventHandler !== 'undefined') {
      element.removeEventListener(eventName, eventHandler, false);
      this._eventMap.delete(listenerName);
    }
  }

}

export default EventActions;
