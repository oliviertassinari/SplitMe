'use strict';

var Immutable = require('immutable');

function reducer(state, action) {
  if (state === undefined) {
    state = Immutable.fromJS({
      export: null,
    });
  }

  switch (action.type) {
    case 'COUCHDB_TAP_EXPORT':
      state = state.set('export', null);
      return state;

    case 'COUCHDB_TAP_EXPORTED':
      if (!action.error) {
        state = state.set('export', action.payload);
      }
      return state;

    default:
      return state;
  }
}

module.exports = reducer;
