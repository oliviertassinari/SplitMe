import Immutable from 'immutable';

import actionTypes from 'redux/actionTypes';

function reducer(state, action) {
  const {
    type,
    payload,
    error,
  } = action;

  if (state === undefined) {
    state = Immutable.fromJS({
      export: null,
      import: 'idle',
    });
  }

  switch (type) {
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
      if (!error) {
        state = state.set('export', payload);
      }
      return state;

    default:
      return state;
  }
}

export default reducer;
