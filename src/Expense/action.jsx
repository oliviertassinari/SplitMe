'use strict';

var dispatcher = require('../dispatcher');

var actions = {
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

  changePaidBy: function(paidByContactId) {
    dispatcher.dispatch({
      actionType: 'EXPENSE_CHANGE_PAID_BY',
      paidByContactId: paidByContactId,
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
};

module.exports = actions;
