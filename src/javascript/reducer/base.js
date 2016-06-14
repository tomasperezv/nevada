'use strict';

const Base = (state: Object = {}, action: Object) => { // eslint-disable-line
  return Object.assign({}, state, { status: action.type });
};

export default Base;
