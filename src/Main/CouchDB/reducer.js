'use strict';

const Immutable = require('immutable');
const actionTypes = require('redux/actionTypes');

function reducer(state, action) {
  if (state === undefined) {
    state = Immutable.fromJS({
      export: null,
      import: 'idle',
    });
  }

  switch (action.type) {
    case actionTypes.COUCHDB_TAP_IMPORT:
    case actionTypes.COUCHDB_TAP_IMPORTED:
      state = state.set('import', 'idle');
      return state;

    case actionTypes.COUCHDB_TAP_IMPORT_START:
      state = state.set('import', 'progress');
      return state;

    case actionTypes.COUCHDB_TAP_EXPORT:
      state = state.set('export', null);
      return state;

    case actionTypes.COUCHDB_TAP_EXPORTED:
      if (!action.error) {
        state = state.set('export', action.payload);
      }
      return state;

    default:
      return state;
  }
}

module.exports = reducer;
