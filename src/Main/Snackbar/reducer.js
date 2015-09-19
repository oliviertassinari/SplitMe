'use strict';

const Immutable = require('immutable');

function reducer(state, action) {
  if (state === undefined) {
    state = Immutable.fromJS({
      show: false,
      message: '',
      actionMessage: null,
      actionTouchTap: null,
    });
  }

  switch (action.type) {
    case 'SNACKBAR_SHOW':
      state = state.set('show', true);
      state = state.set('message', action.message);
      state = state.set('actionMessage', action.actionMessage);
      state = state.set('actionTouchTap', action.actionTouchTap);
      return state;

    case 'SNACKBAR_DISMISS':
      state = state.set('show', false);
      return state;

    default:
      return state;
  }
}

module.exports = reducer;
