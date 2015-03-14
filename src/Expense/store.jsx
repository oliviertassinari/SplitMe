'use strict';

var _ = require('underscore');
var moment = require('moment');

var dispatcher = require('../dispatcher');
var EventEmitter = require('events').EventEmitter;
var API = require('../API');

var _expenseCurrent = null;

function getPaidForContact(contact) {
  return {
    contactId: contact.id, // Reference to a member
    split_equaly: true,
    split_unequaly: '',
    split_shares: '1',
  };
}

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
      if(!_expenseCurrent) {
        _expenseCurrent = {
          description: '',
          amount: '',
          currency: 'EUR',
          date: moment().format('l'),
          type: 'individual',
          paidByContactId: undefined,
          split: 'equaly',
          paidFor: [
            getPaidForContact({id: '0'}),
            getPaidForContact({id: '10'}),
            getPaidForContact({id: '11'}),
          ],
          accounts: [{
            name: 'Nicolas',
            dateLastExpense: 'date',
            members: [{
              id: '0',
              displayName: 'Me',
            },{
              id: '10',
              displayName: 'Nicolas',
            }],
            balances: [{
              value: 9,
              currency: 'EUR',
            }],
          }, {
            name: 'Alexandre',
            dateLastExpense: 'date',
            members: [{
              id: '0',
              displayName: 'Me',
            },{
              id: '11',
              displayName: 'Alexandre',
            }],
            balances: [{
              value: -9,
              currency: 'EUR',
            }],
          }],
        };
        store.emitChange();
      }
      break;

    case 'EXPENSE_CHANGE_DESCRIPTION':
      _expenseCurrent.description = action.description;
      store.emitChange();
      break;

    case 'EXPENSE_CHANGE_AMOUNT':
      _expenseCurrent.amount = action.amount;
      store.emitChange();
      break;

    case 'EXPENSE_CHANGE_PAID_BY':
      _expenseCurrent.paidByContactId = action.paidByContactId;
      store.emitChange();
      break;

    case 'EXPENSE_CHANGE_CURRENCY':
      _expenseCurrent.currency = action.currency;
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

    case 'EXPENSE_PICK_CONTACT':
      var contact = action.contact;

      _expenseCurrent.paidFor.push(getPaidForContact(contact));

      _expenseCurrent.accounts.push({
        name: contact.displayName,
        dateLastExpense: false,
        members: [{
            id: '0',
            displayName: 'Me',
          },
          contact,
        ],
        balances: [{
          value: 0,
          currency: 'EUR',
        }],
      });

      store.emitChange();
      break;

    case 'EXPENSE_TAP_SAVE':
      API.putExpense(_expenseCurrent).then(function() {
        store.emitChange();
      });
      break;

    default:
      // no op
  }
});

module.exports = store;
