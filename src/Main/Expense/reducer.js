'use strict';

const Immutable = require('immutable');
const moment = require('moment');

const API = require('API');
const accountUtils = require('Main/Account/utils');
const actionTypes = require('redux/actionTypes');

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
  let paidFor = new Immutable.List();

  paidFor = paidFor.withMutations(function(paidForMutable) {
    account.get('members').forEach(function(member) {
      paidForMutable.push(getPaidForByMemberDefault(member));
    });
  });

  return expense.set('paidFor', paidFor);
}

let account;
let expenseCurrent;

function reducer(state, action) {
  switch (action.type) {
    case actionTypes.EXPENSE_PICK_CONTACT:
      const contact = action.contact;
      let photo = null;

      if (contact.photos) {
        photo = contact.photos[0].value;
      }

      const member = Immutable.fromJS({
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

    case actionTypes.EXPENSE_TAP_SAVE:
      if (!action.error) {
        account = action.meta.accountCurrent;

        if (action.meta.expenseOpened) { // Already exist
          account = accountUtils.removeExpenseOfAccount(action.meta.expenseOpened, account);
        }

        account = accountUtils.addExpenseToAccount(action.payload, account);
        account = account.set('dateUpdated', moment().unix());

        state.set('accountCurrent', account);
      }
      return state;

    case actionTypes.EXPENSE_TAP_DELETE:
      account = state.get('accountCurrent');
      account = accountUtils.removeExpenseOfAccount(action.payload.expenseCurrent, account);
      account = account.set('dateUpdated', moment().unix());

      state = state.set('accountCurrent', account);
      return state;

    case actionTypes.ROUTER_CHANGE_ROUTE:
      const router = state.get('router');

      if (router) {
        // Mutation based on where we are now
        switch (router.routes[1].path) {
          case 'account/:id/expense/:expenseId/edit':
          case 'account/:id/expense/add':
          case 'expense/add':
            state = state.set('expenseOpened', null);
            state = state.set('expenseCurrent', null);
            break;
        }
      }

      // Mutation based on where we are going
      switch (action.payload.routes[1].path) {
        case 'account/:id/expense/add':
        case 'expense/add':
          state = state.set('expenseOpened', null);

          expenseCurrent = Immutable.fromJS({
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
          break;

        case 'account/:id/expense/:expenseId/edit':
          account = state.get('accountCurrent');
          let expense = account.get('expenses').find((expenseCurrent2) => {
            return expenseCurrent2.get('_id') === API.expenseAddPrefixId(action.payload.params.expenseId);
          });

          // Need to match, will be often skipped
          if (account.get('members').size !== expense.get('paidFor').size) {
            expense = expense.withMutations((expenseMutable) => {
              account.get('members').forEach((memberCurrent) => {
                const found = expense.get('paidFor').find((item) => {
                  return item.get('contactId') === memberCurrent.get('id');
                });

                if (!found) {
                  expenseMutable.update('paidFor', (list) => {
                    return list.push(getPaidForByMemberNew(memberCurrent));
                  });
                }
              });
            });
          }

          expense = expense.set('dateUpdated', moment().unix());

          state = state.set('expenseOpened', expense);
          state = state.set('expenseCurrent', expense);
          return state;
      }

      return state;

    case actionTypes.EXPENSE_CHANGE_RELATED_ACCOUNT:
      expenseCurrent = state.get('expenseCurrent');
      expenseCurrent = setPaidForFromAccount(expenseCurrent, state.get('accountCurrent'));
      state = state.set('expenseCurrent', expenseCurrent);
      return state;

    case actionTypes.EXPENSE_CHANGE_PAID_BY:
      state = state.setIn(['expenseCurrent', 'paidByContactId'], action.paidByContactId);
      return state;

    case actionTypes.EXPENSE_CHANGE_CURRENT:
      state = state.setIn(['expenseCurrent', action.key], action.value);
      return state;

    default:
      return state;
  }
}

module.exports = reducer;
