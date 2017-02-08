/* @flow */
'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import BaseController from './base-controller';

/**
 * @module Reactifier
 */
class Reactifier {
  /**
   * @constructor
   */
  constructor(): void {
    this._methods = [];
  }

  /**
   * @method _getReactAbstractComponent
   * @param {BaseController} controller
   * @public
   */
  _getReactAbstractComponent(controller: BaseController): React.Component {
    /* eslint-disable no-param-reassign */
    return React.createClass({
      propTypes: {},
      getInitialState: () => controller._store.getState()[controller._stateId],
      componentDidMount() {
        var self = this;
        controller._store.subscribe(() => {
          const currentState = controller._store.getState()[controller._stateId];
          self.setState(currentState);
          self.forceUpdate();
        });
      },
      render() {
        return controller._view.render.call(this);
      }
    });
    /* eslint-enable no-param-reassign */
  }

  /**
   * @method render
   * @param {BaseController} controller
   * @public
   */
  render(controller): void {
    /* eslint-disable no-param-reassign */
    const Component = this._getReactAbstractComponent(controller);

    this._methods.forEach((methodKey) => {
      Component.prototype[methodKey] = controller._view[methodKey].bind(controller._view);
    });

    ReactDOM.render(React.createElement(Component), document.querySelector(controller._view.locators.main));
  }

  /**
   * @param {String} methodKey
   * @method addReactMethod
   * @public
   */
  addMethod(methodKey: string): void {
    this._methods.push(methodKey);
  }
}

/**
 * @param {Object} target
 * @param {String} key
 * @method reactify
 */
const reactify = function(target, key) {
  target[key] = target[key].bind(target); // eslint-disable-line no-param-reassign

  if (typeof target.constructor.reactifier === 'undefined') {
    const reactifier = new Reactifier();
    target.constructor.reactifier = reactifier; // eslint-disable-line no-param-reassign
  }

  if (typeof window.React === 'undefined') {
    window.React = React;
    window.ReactDOM = ReactDOM;
  }

  target.constructor.reactifier.addMethod(key);
};

export { Reactifier, reactify };
