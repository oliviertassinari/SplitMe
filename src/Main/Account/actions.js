import {push} from 'redux-router';

import actionTypes from 'redux/actionTypes';
import API from 'API';

const actions = {
  fetchList(force = false) {
    return (dispatch, getState) => {
      const state = getState();

      if (force || !state.get('isAccountsFetched')) {
        dispatch({
          type: actionTypes.ACCOUNT_FETCH_LIST,
          payload: API.fetchAccountAll(),
        });
      }
    };
  },
  fetchDetail() {
    return (dispatch, getState) => {
      const state = getState();
      let accountCurrent = state.get('accountCurrent');

      if (!state.get('accountCurrent')) {
        const params = state.get('router').params;

        API.fetchAccountAll().then((accounts) => {
          const accountId = API.accountAddPrefixId(params.id);

          accountCurrent = accounts.find((account) => {
            return account.get('_id') === accountId;
          });

          dispatch({
            type: actionTypes.ACCOUNT_FETCH_DETAIL,
            payload: API.fetchExpensesOfAccount(accountCurrent),
          });
        });
      } else if (!API.isExpensesFetched(accountCurrent.get('expenses'))) {
        const index = state.get('accounts').indexOf(accountCurrent);

        dispatch({
          type: actionTypes.ACCOUNT_FETCH_DETAIL,
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

      dispatch(push('/accounts'));
      dispatch({
        type: actionTypes.ACCOUNT_TAP_DELETE,
      });

      API.removeAccount(state.get('accountCurrent'));
    };
  },
};

export default actions;
