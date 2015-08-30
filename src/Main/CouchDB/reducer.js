'use strict';

var Immutable = require('immutable');

function reducer(state, action) {
  if (state === undefined) {
    state = Immutable.fromJS({
      export: null,
      import: 'idle',
    });
  }

  switch (action.type) {
    case 'COUCHDB_TAP_IMPORT':
    case 'COUCHDB_TAP_IMPORTED':
      state = state.set('import', 'idle');
      return state;

    case 'COUCHDB_TAP_IMPORT_START':
      state = state.set('import', 'progress');
      return state;

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
