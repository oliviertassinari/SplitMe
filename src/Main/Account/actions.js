'use strict';

const API = require('API');

const actions = {
  fetchAll() {
    return {
      type: 'ACCOUNT_FETCH_ALL',
      payload: API.fetchAccountAll(),
    };
  },
  tapList(account) {
    return function(dispatch, getState) {
      dispatch({
        type: 'ACCOUNT_TAP_LIST',
        account: account,
      });

      const state = getState();
      const accountCurrent = getState().get('accountCurrent');

      if (!API.isExpensesFetched(accountCurrent.get('expenses'))) {
        const index = state.get('accounts').indexOf(accountCurrent);

        dispatch({
          type: 'ACCOUNT_TAP_LIST',
          payload: API.fetchExpensesOfAccount(accountCurrent),
          meta: {
            index: index,
          },
        });
      }
    };
  },
  replaceAccount(accountNew, accountOld, useAsCurrent, clearOpened) {
    return function(dispatch, getState) {
      dispatch({
        type: 'ACCOUNT_REPLACE_ACCOUNT',
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
  tapAddExpense() {
    return {
      type: 'ACCOUNT_TAP_ADD_EXPENSE',
    };
  },
  tapAddExpenseForAccount(account) {
    return {
      type: 'ACCOUNT_TAP_ADD_EXPENSE_FOR_ACCOUNT',
      account: account,
    };
  },
  navigateHome() {
    return {
      type: 'ACCOUNT_NAVIGATE_HOME',
    };
  },
  tapSettings() {
    return {
      type: 'ACCOUNT_TAP_SETTINGS',
    };
  },
  deleteCurrent() {
    return function(dispatch, getState) {
      const state = getState();

      dispatch({
        type: 'ACCOUNT_DELETE_CURRENT',
      });

      API.removeAccount(state.get('accountCurrent'));
    };
  },
  tapAddAccount() {
    return {
      type: 'ACCOUNT_TAP_ADD_ACCOUNT',
    };
  },
};

module.exports = actions;
