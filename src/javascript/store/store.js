/* @flow */
'use strict';
/* global devToolsExtension */

import { combineReducers, createStore } from 'redux';

class Store {
  _store: Object|null;
  _reducers: Object;

  constructor() {
    this._store = null;
    this._reducers = {};
  }

  /**
   * Creates a new Redux Store
   * @param  {Object} initialState
   * @return {Object}
   * @public
   */
  configureStore(reducers: Object, initialState: Object = {}) {
    this._reducers = Object.assign(reducers, this._reducers);
    const combinedReducers = combineReducers(this._reducers);
    const ext = window.devToolsExtension ? window.devToolsExtension() : undefined;
    this._store = createStore(combinedReducers, Object.assign(initialState, this.getGlobalState()), ext);
    return this._store;
  }

  getGlobalState(): Object {
    let state = {};
    if (this._store !== null) {
      state = this._store.getState();
    }
    return state;
  }

}

export default new Store();
