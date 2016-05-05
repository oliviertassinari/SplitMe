import actionTypes from 'redux/actionTypes';
import API from 'API';
import accountActions from 'main/account/actions';
import {push} from 'react-router-redux';

const actions = {
  tapImport() {
    return (dispatch) => {
      dispatch({
        type: actionTypes.SETTINGS_TAP_IMPORT,
      });
    };
  },
  tapImportStart(string) {
    return (dispatch) => {
      dispatch({
        type: actionTypes.SETTINGS_TAP_IMPORT_START,
      });
      dispatch({
        type: actionTypes.SETTINGS_TAP_IMPORTED,
        payload: API.import(string),
      }).then(() => {
        dispatch(push('/settings'));
        dispatch(accountActions.fetchList(true));
      });
    };
  },
  tapExport() {
    return (dispatch) => {
      dispatch({
        type: actionTypes.SETTINGS_TAP_EXPORT,
      });
      dispatch({
        type: actionTypes.SETTINGS_TAP_EXPORTED,
        payload: API.export(),
      });
    };
  },
};

export default actions;
