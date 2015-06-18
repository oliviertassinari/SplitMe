'use strict';

var dispatcher = require('Main/dispatcher');

var action = {
  tapClose: function() {
    dispatcher.dispatch({
      actionType: 'EXPENSE_TAP_CLOSE',
    });
  },
  tapSave: function() {
    dispatcher.dispatch({
      actionType: 'EXPENSE_TAP_SAVE',
    });
  },
  tapList: function(expense) {
    dispatcher.dispatch({
      actionType: 'EXPENSE_TAP_LIST',
      expense: expense,
    });
  },
  changeDescription: function(description) {
    dispatcher.dispatch({
      actionType: 'EXPENSE_CHANGE_DESCRIPTION',
      description: description,
    });
  },
  changeAmount: function(amount) {
    dispatcher.dispatch({
      actionType: 'EXPENSE_CHANGE_AMOUNT',
      amount: amount,
    });
  },
  changeCurrency: function(currency) {
    dispatcher.dispatch({
      actionType: 'EXPENSE_CHANGE_CURRENCY',
      currency: currency,
    });
  },
  changeDate: function(date) {
    dispatcher.dispatch({
      actionType: 'EXPENSE_CHANGE_DATE',
      date: date,
    });
  },
  changePaidBy: function(paidByContactId) {
    dispatcher.dispatch({
      actionType: 'EXPENSE_CHANGE_PAID_BY',
      paidByContactId: paidByContactId,
    });
  },
  changeRelatedAccount: function(relatedAccount) {
    dispatcher.dispatch({
      actionType: 'EXPENSE_CHANGE_RELATED_ACCOUNT',
      relatedAccount: relatedAccount,
    });
  },
  changeSplit: function(split) {
    dispatcher.dispatch({
      actionType: 'EXPENSE_CHANGE_SPLIT',
      split: split,
    });
  },
  changePaidFor: function(paidFor) {
    dispatcher.dispatch({
      actionType: 'EXPENSE_CHANGE_PAID_FOR',
      paidFor: paidFor,
    });
  },
  pickContact: function(contact) {
    dispatcher.dispatch({
      actionType: 'EXPENSE_PICK_CONTACT',
      contact: contact,
    });
  },
  navigateBack: function(page) {
    dispatcher.dispatch({
      actionType: 'EXPENSE_NAVIGATE_BACK',
      page: page,
    });
  },
};

module.exports = action;
