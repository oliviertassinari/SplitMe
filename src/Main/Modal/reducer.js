'use strict';

var Immutable = require('immutable');

function reducer(state, action) {
  if (state === undefined) {
    state = new Immutable.Map();
  }

  switch (action.type) {
    case 'MODAL_UPDATE':
      state = state.set('title', action.title);
      state = state.set('actions', action.actions);
      return state;

    default:
      return state;
  }
}

module.exports = reducer;
