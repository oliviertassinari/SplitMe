import Immutable from 'immutable';
import moment from 'moment';

import API from 'API';
import accountUtils from 'main/account/utils';
import actionTypes from 'redux/actionTypes';

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

  paidFor = paidFor.withMutations((paidForMutable) => {
    account.get('members').forEach((member) => {
      paidForMutable.push(getPaidForByMemberDefault(member));
    });
  });

  return expense.set('paidFor', paidFor);
}

export function setPaidByFromAccount(expense, account) {
  const member = accountUtils.getMemberEntry(account, expense.get('paidByContactId'));

  if (!member) {
    expense = expense.set('paidByContactId', null);
  }

  return expense;
}

const stateInit = Immutable.fromJS({
  allowExit: true,
  accountCurrent: null,
  accountOpened: null,
  expenseCurrent: null,
  expenseOpened: null,
  fetched: false,
  deleting: false,
  closing: false,
});

function reducer(state, action) {
  const {
    type,
    payload,
    error,
  } = action;

  if (state === undefined) {
    state = stateInit;
  }

  let account;
  let expenseCurrent;

  switch (type) {
    case actionTypes.EXPENSE_ADD_FETCH:
      state = state.set('fetched', true);

      if (error) {
        return state;
      }

      if (payload && payload.account) {
        state = state.set('accountOpened', payload.account);
        state = state.set('accountCurrent', payload.account);
      } else {
        state = state.set('accountOpened', null);
        state = state.set('accountCurrent', Immutable.fromJS({
          name: '',
          members: [{
            id: '0',
            name: null,
            email: null,
            photo: null,
            balances: [],
          }],
          expenses: [],
          share: false,
          dateLatestExpense: null,
          dateCreated: moment().unix(),
          dateUpdated: moment().unix(),
          couchDBDatabaseName: null,
        }));
      }

      let expense;

      if (payload && payload.expenseId) {
        account = state.get('accountCurrent');

        const expenseId = API.expenseAddPrefixId(payload.expenseId);
        expense = account.get('expenses').find((expenseCurrent2) => {
          return expenseCurrent2.get('_id') === expenseId;
        });

        // The expense can't be found
        if (!expense) {
          return state;
        }

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
      } else {
        expense = Immutable.fromJS({
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
        expense = setPaidForFromAccount(expense, state.get('accountCurrent'));
      }

      state = state.set('expenseOpened', expense);
      state = state.set('expenseCurrent', expense);
      return state;

    case actionTypes.EXPENSE_ADD_ADD_MEMBER:
      state = state.set('allowExit', false);
      state = state.updateIn(['accountCurrent', 'members'], (list) => {
        return list.push(action.payload.member);
      });

      const {
        member,
        useAsPaidBy,
      } = payload;

      if (useAsPaidBy) {
        state = state.setIn(['expenseCurrent', 'paidByContactId'], member.get('id'));
      }
      state = state.updateIn(['expenseCurrent', 'paidFor'], (list) => {
        return list.push(getPaidForByMemberDefault(member));
      });
      return state;

    case actionTypes.EXPENSE_ADD_CHANGE_RELATED_ACCOUNT:
      state = state.set('allowExit', false);
      const relatedAccount = action.payload.relatedAccount;
      if (state.get('accountOpened') === null) {
        state = state.set('accountOpened', relatedAccount);
      }
      state = state.set('accountCurrent', relatedAccount);

      expenseCurrent = state.get('expenseCurrent');
      expenseCurrent = setPaidForFromAccount(expenseCurrent, relatedAccount);
      expenseCurrent = setPaidByFromAccount(expenseCurrent, relatedAccount);
      state = state.set('expenseCurrent', expenseCurrent);
      return state;

    case actionTypes.EXPENSE_ADD_CHANGE_PAID_BY:
      state = state.set('allowExit', false);
      state = state.setIn(['expenseCurrent', 'paidByContactId'], payload.paidByContactId);
      return state;

    case actionTypes.EXPENSE_ADD_CHANGE_PAID_FOR:
      state = state.set('allowExit', false);
      const {
        split,
        index,
      } = payload;

      let splitKey;

      switch (split) {
        case 'equaly':
          splitKey = 'split_equaly';
          break;

        case 'unequaly':
          splitKey = 'split_unequaly';
          break;

        case 'shares':
          splitKey = 'split_shares';
          break;
      }

      state = state.setIn(['expenseCurrent', 'paidFor', index, splitKey], payload.value);

      return state;

    case actionTypes.EXPENSE_ADD_CHANGE_CURRENT:
      state = state.set('allowExit', false);
      const {
        key,
        value,
      } = payload;

      state = state.setIn(['expenseCurrent', key], value);
      return state;

    case actionTypes.EXPENSE_ADD_TAP_SAVE:
      if (!error) {
        account = state.get('accountCurrent');

        if (state.getIn(['expenseOpened', '_id'])) { // Already exist
          account = accountUtils.removeExpenseOfAccount(state.get('expenseOpened'), account);
        }

        account = accountUtils.addExpenseToAccount(payload, account);
        account = account.set('dateUpdated', moment().unix());

        state = state.set('accountCurrent', account);
        state = state.set('allowExit', true);
      }
      return state;

    case actionTypes.EXPENSE_ADD_DELETE_CONFIRM:
      account = state.get('accountCurrent');
      account = accountUtils.removeExpenseOfAccount(payload.expense, account);
      account = account.set('dateUpdated', moment().unix());

      state = state.set('accountCurrent', account);
      return state;

    case actionTypes.EXPENSE_ADD_TAP_CLOSE:
      state = state.set('allowExit', true);
      state = state.set('closing', true);
      return state;

    case actionTypes.EXPENSE_ADD_TAP_DELETE:
      state = state.set('deleting', true);
      return state;

    case actionTypes.EXPENSE_ADD_UNMOUNT:
      state = stateInit;
      return state;

    default:
      return state;
  }
}

export default reducer;
