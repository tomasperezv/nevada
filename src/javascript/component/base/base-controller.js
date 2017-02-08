/* @flow */
/* global window */
'use strict';

import BaseView from './base-view';
// $FlowFixMe: Importing coffee modules
import EventBus from '../../../coffeescript/event_bus.coffee';
import Store from '../../store/store';
import BaseReducer from '../../reducer/base';

/**
 * The base class for controllers
 * @module BaseController
 */
class BaseController {
  _view: BaseView;
  _id: string;
  _stateId: string;
  _options: Object;
  _eventBus: EventBus;
  _store: Object;

  /**
   * @param {Object} overrides
   * @constructor
   */
  constructor(overrides: Object = {}) {
    this._options = {
      render: true,
      locator: null,
      id: 'BaseController',
      loadView: true
    };
    Object.assign(this._options, overrides);

    this._eventBus = EventBus;
    this._id = this._options.id;
    this._initializeRedux();

    if (this._options.loadView) {
      this._view = this._getViewInstance();
      if (this._options.render) {
        this.render();
      }
    }
  }

  /**
   * @return {Object}
   * @method getInitialState
   * @public
   */
  getInitialState(): Object {
    return {};
  }

  /**
   * @method _initializeRedux
   * @private
   */
  _initializeRedux(): void {
    if (typeof window !== 'undefined') {
      this._stateId = `${this._id}${Math.random()}`;

      const state = {};
      state[this._stateId] = this.getInitialState();

      const reducer = {};
      reducer[this._stateId] = BaseReducer;

      this._store = Store.configureStore(reducer, state);
      this._subscribeToStoreChanges();
    }
  }

  /**
   * @method getView
   * @returns {BaseView}
   * @public
   */
  getView(): BaseView {
    return this._view;
  }

  /**
   * @method _requireAndGetViewClass
   * @returns {Class}
   * @private
   */
  _requireAndGetViewClass(): Class<BaseView> { // eslint-disable-line
    let dependency = null;

    /* global modulejs */
    // $FlowFixMe: modulejs is not defined
    if (typeof modulejs !== 'undefined') {
      dependency = modulejs.require(`${this._id.replace('Controller', '')}View`);
    }

    if (dependency === null) {
      const id = `${this._getViewImportName()}`;
      // $FlowFixMe: string interpolation
      dependency = require(`./${id}`).default;
    }

    return dependency;
  }

  /**
   * @method _getViewInstance
   * @returns {BaseView}
   * @private
   */
  _getViewInstance(): BaseView {
    const View = this._requireAndGetViewClass();
    return new View({ locator: this._options.locator, controller: this, id: this._options.id });
  }

  /**
   * @method render
   * @public
   */
  render(): void {
    this._eventBus.publish(`render${this._id}`, { id: this._id });
    if (typeof this._view.constructor.reactifier !== 'undefined') {
      this._view.constructor.reactifier.render(this);
    } else {
      this._view.render();
    }
  }

  /**
   * @method _getViewImportName
   * @returns {String}
   * @private
   */
  _getViewImportName(): string {
    // TODO: this.constructor.name gets mangled by uglify and/or webpack, we'd need to find a way
    // to determine dynamically the current's instance class name.
    let viewName = `${this._id}View`;
    viewName = viewName.split('');
    viewName = viewName.map((current, position) => {
      let result = current;
      if (position === 0) {
        result = current.toLowerCase();
      } else if (current === current.toUpperCase()) {
        result = `-${current.toLowerCase()}`;
      }

      return result;
    });

    return viewName.join('').replace('controller-', '');
  }

  /**
   * @method _subscribeToStoreChanges
   * @private
   */
  _subscribeToStoreChanges(): void {
    const self = this;
    const select = (state) => state[self._stateId];

    let currentState = null;
    window.store = self._store;
    this._store.subscribe(() => {
      const previousState = currentState;
      currentState = select(self._store.getState());
      if (currentState !== previousState) {
        // $FlowFixMe: Indexable signature not found
        const viewMethod = self._view[currentState.status];
        if (typeof viewMethod === 'function') {
          viewMethod.bind(self._view)();
        }
      }
    });
  }

  /**
   * @param {String} state
   * @method onStateChange
   * @public
   */
  onStateChange(state:string): void {
    this._store.dispatch({ type: state });
  }
}

export default BaseController;
