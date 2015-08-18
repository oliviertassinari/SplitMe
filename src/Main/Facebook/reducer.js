'use strict';

var Immutable = require('immutable');

function reducer(state, action) {
  if (state === undefined) {
    state = new Immutable.Map();
  }

  switch (action.type) {
    case 'FACEBOOK_LOGIN':
      return state;

    case 'FACEBOOK_UPDATE_LOGIN_STATUS':
      return state;

    case 'FACEBOOK_UPDATE_ME_INFO':
      return state;

    default:
      return state;
  }
}

module.exports = reducer;
