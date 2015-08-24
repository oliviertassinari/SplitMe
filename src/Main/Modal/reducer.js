'use strict';

var Immutable = require('immutable');

function reducer(state, action) {
  if (state === undefined) {
    state = Immutable.fromJS({
      title: '',
      actions: [],
    });
  }

  switch (action.type) {
    case 'MODAL_UPDATE':
      state = state.set('title', action.title);
      state = state.set('actions', Immutable.fromJS(action.actions));
      return state;

    default:
      return state;
  }
}

module.exports = reducer;
