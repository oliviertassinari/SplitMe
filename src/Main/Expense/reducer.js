'use strict';

var Immutable = require('immutable');
var moment = require('moment');
var accountUtils = require('Main/Account/utils');

function getPaidForByMemberDefault(member) {
  return Immutable.fromJS({
    contactId: member.get('id'), // Reference to a member
    split_equaly: true,
    split_unequaly: null,
    split_shares: 1,
  });
}
function getPaidForByMemberNew(member) {
  return Immutable.fromJS({
    contactId: member.get('id'), // Reference to a member
    split_equaly: false,
    split_unequaly: null,
    split_shares: 0,
  });
}

function setPaidForFromAccount(expense, account) {
  var paidFor = new Immutable.List();

  paidFor = paidFor.withMutations(function(paidForMutable) {
    account.get('members').forEach(function(member) {
      paidForMutable.push(getPaidForByMemberDefault(member));
    });
  });

  return expense.set('paidFor', paidFor);
}

function reducer(state, action) {
  switch (action.type) {
    case 'EXPENSE_TAP_LIST':
      var account = state.get('accountCurrent');
      var expense = action.expense;

      // Need to match, will be often skipped
      if (account.get('members').size !== expense.get('paidFor').size) {
        expense = expense.withMutations(function(expenseMutable) {
          account.get('members').forEach(function(member) {
            var found = expense.get('paidFor').find(function(item) {
              return item.get('contactId') === member.get('id');
            });

            if (!found) {
              expenseMutable.update('paidFor', function(list) {
                return list.push(getPaidForByMemberNew(member));
              });
            }
          });
        });
      }

      expense = expense.set('dateUpdated', moment().unix());

      state = state.set('expenseOpened', expense);
      state = state.set('expenseCurrent', expense);
      return state;

    case 'EXPENSE_PICK_CONTACT':
      var contact = action.contact;
      var photo = null;

      if (contact.photos) {
        photo = contact.photos[0].value;
      }

      var member = Immutable.fromJS({
        id: contact.id,
        name: contact.displayName,
        email: null,
        photo: photo,
        balances: [],
      });

      if (action.useAsPaidBy) {
        state = state.setIn(['expenseCurrent', 'paidByContactId'], member.get('id'));
      }

      state = state.updateIn(['accountCurrent', 'members'], function(list) {
        return list.push(member);
      });
      state = state.updateIn(['expenseCurrent', 'paidFor'], function(list) {
        return list.push(getPaidForByMemberDefault(member));
      });
      return state;

    case 'EXPENSE_TAP_SAVE':
      state = state.set('expenseOpened', null);
      state = state.set('expenseCurrent', null);
      return state;

    case 'EXPENSE_TAP_SAVED':
      if (!action.error) {
        var account = state.get('accountCurrent');

        if (action.meta.expenseOpened) { // Already exist
          account = accountUtils.removeExpenseOfAccount(action.meta.expenseOpened, account);
        }

        account = accountUtils.addExpenseToAccount(action.payload, account);

        state.set('accountCurrent', account);
      }
      return state;

    case 'EXPENSE_DELETE_CURRENT':
      var expenseCurrent = state.get('expenseCurrent');

      state = state.set('expenseOpened', null);
      state = state.set('expenseCurrent', null);

      var account = state.get('accountCurrent');
      account = accountUtils.removeExpenseOfAccount(expenseCurrent, account);
      state = state.set('accountCurrent', account);
      return state;

    case 'EXPENSE_CLOSE':
      state = state.set('expenseOpened', null);
      state = state.set('expenseCurrent', null);
      return state;

    case 'ACCOUNT_TAP_ADD_EXPENSE':
    case 'ACCOUNT_TAP_ADD_EXPENSE_FOR_ACCOUNT':
      state = state.set('expenseOpened', null);

      var expenseCurrent = Immutable.fromJS({
        description: '',
        amount: null,
        currency: 'EUR',
        date: moment().format('YYYY-MM-DD'),
        paidByContactId: null,
        split: 'equaly',
        paidFor: null,
        account: null,
        dateCreated: moment().unix(),
        dateUpdated: moment().unix(),
      });
      expenseCurrent = setPaidForFromAccount(expenseCurrent, state.get('accountCurrent'));

      state = state.set('expenseCurrent', expenseCurrent);
      return state;

    case 'EXPENSE_CHANGE_RELATED_ACCOUNT':
      var expenseCurrent = state.get('expenseCurrent');
      expenseCurrent = setPaidForFromAccount(expenseCurrent, state.get('accountCurrent'));
      state = state.set('expenseCurrent', expenseCurrent);
      return state;

    case 'EXPENSE_CHANGE_PAID_BY':
      state = state.setIn(['expenseCurrent', 'paidByContactId'], action.paidByContactId);
      return state;

    case 'EXPENSE_CHANGE_CURRENT':
      state = state.setIn(['expenseCurrent', action.key], action.value);
      return state;

    default:
      return state;
  }
}

module.exports = reducer;
