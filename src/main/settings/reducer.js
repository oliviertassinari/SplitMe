
import Immutable from 'immutable';
import actionTypes from 'redux/actionTypes';

function settingsReducer(state, action) {
  const {
    type,
    payload,
    error,
  } = action;

  if (state === undefined) {
    state = Immutable.fromJS({
      dataImport: {
        status: 'idle',
      },
      dataExport: {
        status: 'idle',
        payload: null,
      },
    });
  }

  switch (type) {
    case actionTypes.SETTINGS_TAP_IMPORT:
    case actionTypes.SETTINGS_TAP_IMPORTED:
      state = state.setIn(['dataImport', 'status'], 'idle');
      return state;

    case actionTypes.SETTINGS_TAP_IMPORT_START:
      state = state.setIn(['dataImport', 'status'], 'progress');
      return state;

    case actionTypes.SETTINGS_TAP_EXPORT:
      state = state.setIn(['dataExport', 'status'], 'progress');
      state = state.setIn(['dataExport', 'payload'], null);
      return state;

    case actionTypes.SETTINGS_TAP_EXPORTED:
      if (error) {
        state = state.setIn(['dataExport', 'status'], 'error');
      } else {
        state = state.setIn(['dataExport', 'status'], 'idle');
        state = state.setIn(['dataExport', 'payload'], payload);
      }
      return state;

    default:
      return state;
  }
}

export default settingsReducer;
