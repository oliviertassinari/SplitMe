'use strict';

var _ = require('underscore');
var moment = require('moment');

var dispatcher = require('../dispatcher');
var EventEmitter = require('events').EventEmitter;

var _expenseCurrent = null;

var store = _.extend({}, EventEmitter.prototype, {
  getCurrent: function() {
    return _expenseCurrent;
  },
  emitChange: function() {
    this.emit('change');
  },
  addChangeListener: function(callback) {
    this.on('change', callback);
  },
  removeChangeListener: function(callback) {
    this.removeListener('change', callback);
  }
});

/**
 * Register callback to handle all updates
 */
dispatcher.register(function(action) {
  switch(action.actionType) {
    case 'NAVIGATE_ADD_EXPENSE':
    case 'TAP_ADD_EXPENSE':
      _expenseCurrent = {
        description: '',
        amount: '',
        currency: 'EUR',
        date: moment().format('l'),
        type: 'individual',
        paidBy: undefined,
        split: 'equaly',
        paidFor: [{
          contactName: 'Me', // Reference to a member
          split_equaly: true,
          split_unequaly: '',
          split_shares: '1',
        },{
          contactName: 'Nicolas', // Reference to a member
          split_equaly: true,
          split_unequaly: '',
          split_shares: '1',
        }],
        account: {
          members: [{
            name: 'Me'
          },{
            name: 'Nicolas'
          }]
        },
      };
      store.emitChange();
      break;

    case 'EXPENSE_CHANGE_PAID_BY':
      _expenseCurrent.paidBy = action.paidBy;
      store.emitChange();
      break;

    case 'EXPENSE_CHANGE_SPLIT':
      _expenseCurrent.split = action.split;
      store.emitChange();
      break;

    case 'EXPENSE_CHANGE_PAID_FOR':
      _expenseCurrent.paidFor = action.paidFor;
      store.emitChange();
      break;

    default:
      // no op
  }
});

module.exports = store;
