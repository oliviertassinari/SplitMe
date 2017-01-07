// @flow weak

import API from 'API';
import actionTypes from 'redux/actionTypes';

const accountActions = {
  fetchList(force = false) {
    return (dispatch, getState) => {
      const state = getState();

      if (force || state.getIn(['account', 'accounts', 'status']) !== 'success') {
        return dispatch({
          type: actionTypes.ACCOUNT_FETCH_LIST,
          payload: API.fetchAccountAll(),
        });
      }

      return Promise.resolve();
    };
  },
  replaceAccount(accountNew, accountOld) {
    return (dispatch, getState) => {
      return dispatch({
        type: actionTypes.ACCOUNT_REPLACE_ACCOUNT,
        payload: API.putAccount(accountNew),
        meta: {
          index: getState().getIn(['account', 'accounts', 'payload']).indexOf(accountOld),
        },
      });
    };
  },
};

export default accountActions;
