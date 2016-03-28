import {push} from 'react-router-redux';

import API from 'API';
import actionTypes from 'redux/actionTypes';
import accountActions from 'main/account/actions';
import accountUtils from 'main/account/utils';

const actions = {
  fetch(accountId) {
    return (dispatch, getState) => {
      return dispatch(accountActions.fetchList()).then(() => {
        const state = getState();
        const accountEntry = accountUtils.findEntry(
          state.getIn(['account', 'accounts']),
          accountId
        );

        if (accountEntry) {
          if (!API.isExpensesFetched(accountEntry[1].get('expenses'))) {
            return dispatch({
              type: actionTypes.ACCOUNT_DETAIL_FETCH,
              payload: API.fetchExpensesOfAccount(accountEntry[1]),
              meta: {
                index: accountEntry[0],
              },
            });
          } else {
            return dispatch({
              type: actionTypes.ACCOUNT_DETAIL_FETCH,
            });
          }
        } else {
          return dispatch({
            type: actionTypes.ACCOUNT_DETAIL_FETCH,
            error: true,
          });
        }
      });
    };
  },
  tapDelete(accountId) {
    return (dispatch, getState) => {
      const state = getState();
      const accountEntry = accountUtils.findEntry(
        state.getIn(['account', 'accounts']),
        accountId
      );

      dispatch(push('/accounts'));
      dispatch({
        type: actionTypes.ACCOUNT_DETAIL_TAP_DELETE,
        payload: {
          accountIndex: accountEntry[0],
        },
      });

      API.removeAccount(accountEntry[1]);
    };
  },
  unmount() {
    return {
      type: actionTypes.ACCOUNT_DETAIL_UNMOUNT,
    };
  },
};

export default actions;
