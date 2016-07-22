// @flow weak

import API from 'API';
import actionTypes from 'redux/actionTypes';

const actions = {
  fetchList(force = false) {
    return (dispatch, getState) => {
      const state = getState();

      if (force || !state.getIn(['account', 'isAccountsFetched'])) {
        return dispatch({
          type: actionTypes.ACCOUNT_FETCH_LIST,
          payload: API.fetchAccountAll(),
        });
      } else {
        return new Promise((resolve) => {
          resolve();
        });
      }
    };
  },
  replaceAccount(accountNew, accountOld) {
    return (dispatch, getState) => {
      return dispatch({
        type: actionTypes.ACCOUNT_REPLACE_ACCOUNT,
        payload: API.putAccount(accountNew),
        meta: {
          index: getState().getIn(['account', 'accounts']).indexOf(accountOld),
        },
      });
    };
  },
};

export default actions;
