'use strict';

var dispatcher = require('Main/dispatcher');

var action = {
  fetchAll: function() {
    dispatcher.dispatch({
      actionType: 'ACCOUNT_FETCH_ALL',
    });
  },
  tapList: function(account) {
    dispatcher.dispatch({
      actionType: 'ACCOUNT_TAP_LIST',
      account: account,
    });
  },
  tapAddExpense: function() {
    dispatcher.dispatch({
      actionType: 'TAP_ADD_EXPENSE',
    });
  },
  tapAddExpenseForAccount: function(account) {
    dispatcher.dispatch({
      actionType: 'TAP_ADD_EXPENSE_FOR_ACCOUNT',
      account: account,
    });
  },
  navigateHome: function() {
    dispatcher.dispatch({
      actionType: 'ACCOUNT_NAVIGATE_HOME',
    });
  },
  tapExpenses: function() {
    dispatcher.dispatch({
      actionType: 'ACCOUNT_TAP_EXPENSES',
    });
  },
  tapBalance: function() {
    dispatcher.dispatch({
      actionType: 'ACCOUNT_TAP_BALANCE',
    });
  },
  tapDebts: function() {
    dispatcher.dispatch({
      actionType: 'ACCOUNT_TAP_DEBTS',
    });
  },
  tapSettings: function() {
    dispatcher.dispatch({
      actionType: 'ACCOUNT_TAP_SETTINGS',
    });
  },
  addMember: function(member) {
    dispatcher.dispatch({
      actionType: 'ACCOUNT_ADD_MEMBER',
      member: member,
    });
  },
};

module.exports = action;
