import {pushState} from 'redux-router';

import actionTypes from 'redux/actionTypes';
import API from 'API';

const actions = {
  showList() {
    return {
      type: actionTypes.ACCOUNT_SHOW_LIST,
      payload: API.fetchAccountAll(),
    };
  },
  showDetail() {
    return (dispatch, getState) => {
      const state = getState();
      const accountCurrent = getState().get('accountCurrent');

      if (!API.isExpensesFetched(accountCurrent.get('expenses'))) {
        const index = state.get('accounts').indexOf(accountCurrent);

        dispatch({
          type: actionTypes.ACCOUNT_SHOW_DETAIL,
          payload: API.fetchExpensesOfAccount(accountCurrent),
          meta: {
            index: index,
          },
        });
      }
    };
  },
  replaceAccount(accountNew, accountOld, useAsCurrent, clearOpened) {
    return (dispatch, getState) => {
      dispatch({
        type: actionTypes.ACCOUNT_REPLACE_ACCOUNT,
        payload: API.putAccount(accountNew),
        meta: {
          index: getState().get('accounts').indexOf(accountOld),
          accountOld: accountOld,
          useAsCurrent: useAsCurrent,
          clearOpened: clearOpened,
        },
      });
    };
  },
  tapDelete() {
    return (dispatch, getState) => {
      const state = getState();

      dispatch(pushState(null, '/'));
      dispatch({
        type: actionTypes.ACCOUNT_TAP_DELETE,
      });

      API.removeAccount(state.get('accountCurrent'));
    };
  },
};

export default actions;
