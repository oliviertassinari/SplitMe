import {push} from 'react-router-redux';
import Lie from 'lie';

import API from 'API';
import actionTypes from 'redux/actionTypes';
import accountActions from 'main/account/actions';
import accountUtils from 'main/account/utils';

const actions = {
  fetchList(force = false) {
    return (dispatch, getState) => {
      const state = getState();

      if (force || !state.get('isAccountsFetched')) {
        return dispatch({
          type: actionTypes.ACCOUNT_FETCH_LIST,
          payload: API.fetchAccountAll(),
        });
      } else {
        return new Lie((resolve) => {
          resolve();
        });
      }
    };
  },
  fetchDetail(accountId) {
    return (dispatch, getState) => {
      return dispatch(accountActions.fetchList()).then(() => {
        const state = getState();
        const accountEntry = accountUtils.findEntry(state.get('accounts'), accountId);

        if (accountEntry && !API.isExpensesFetched(accountEntry[1].get('expenses'))) {
          return dispatch({
            type: actionTypes.ACCOUNT_FETCH_DETAIL,
            payload: API.fetchExpensesOfAccount(accountEntry[1]),
            meta: {
              index: accountEntry[0],
            },
          });
        } else {
          return new Lie((resolve) => {
            resolve();
          });
        }
      });
    };
  },
  replaceAccount(accountNew, accountOld) {
    return (dispatch, getState) => {
      return dispatch({
        type: actionTypes.ACCOUNT_REPLACE_ACCOUNT,
        payload: API.putAccount(accountNew),
        meta: {
          index: getState().get('accounts').indexOf(accountOld),
        },
      });
    };
  },
  tapDelete(accountId) {
    return (dispatch, getState) => {
      const state = getState();
      const accountEntry = accountUtils.findEntry(state.get('accounts'), accountId);

      dispatch(push('/accounts'));
      dispatch({
        type: actionTypes.ACCOUNT_TAP_DELETE,
        payload: {
          accountIndex: accountEntry[0],
        },
      });

      API.removeAccount(accountEntry[1]);
    };
  },
};

export default actions;
