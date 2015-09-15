'use strict';

const Immutable = require('immutable');

function reducer(state, action) {
  if (state === undefined) {
    state = new Immutable.Map();
  }

  switch (action.type) {
    case 'FACEBOOK_LOGIN':
    case 'FACEBOOK_UPDATE_LOGIN_STATUS':
      if (!action.error) {
        state = Immutable.fromJS(action.payload);
      }
      return state;

    case 'FACEBOOK_UPDATE_ME_INFO':
      if (!action.error) {
        state = state.set('me', Immutable.fromJS(action.payload));
      }
      return state;

    default:
      return state;
  }
}

module.exports = reducer;
