'use strict';

var API = require('API');

var actions = {
  fetchAll: function() {
    return {
      type: 'ACCOUNT_FETCH_ALL',
      payload: API.fetchAccountAll(),
    };
  },
  tapList: function(account) {
    return function(dispatch, getState) {
      dispatch({
        type: 'ACCOUNT_TAP_LIST',
        account: account,
      });

      var state = getState();
      var accountCurrent = getState().get('accountCurrent');

      if (!API.isExpensesFetched(accountCurrent.get('expenses'))) {
        var index = state.get('accounts').indexOf(accountCurrent);

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
  replaceAccount: function(accountNew, accountOld, useAsCurrent, clearOpened) {
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
  tapAddExpense: function() {
    return {
      type: 'ACCOUNT_TAP_ADD_EXPENSE',
    };
  },
  tapAddExpenseForAccount: function(account) {
    return {
      type: 'ACCOUNT_TAP_ADD_EXPENSE_FOR_ACCOUNT',
      account: account,
    };
  },
  navigateHome: function() {
    return {
      type: 'ACCOUNT_NAVIGATE_HOME',
    };
  },
  tapSettings: function() {
    return {
      type: 'ACCOUNT_TAP_SETTINGS',
    };
  },
  deleteCurrent: function() {
    return function(dispatch, getState) {
      var state = getState();

      dispatch({
        type: 'ACCOUNT_DELETE_CURRENT',
      });

      API.removeAccount(state.get('accountCurrent'));
    };
  },
};

module.exports = actions;
