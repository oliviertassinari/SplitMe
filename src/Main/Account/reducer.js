import Immutable from 'immutable';
import moment from 'moment';
import actionTypes from 'redux/actionTypes';

import API from 'API';
import accountUtils from 'Main/Account/utils';

function reducer(state, action) {
  switch (action.type) {
    case actionTypes.ACCOUNT_SHOW_LIST:
      if (!action.error) {
        state = state.set('accounts', action.payload);
        state = state.set('isAccountsFetched', true);
      }
      return state;

    case actionTypes.ACCOUNT_REPLACE_ACCOUNT:
      if (!action.error) {
        if (action.meta.index === -1) {
          state = state.update('accounts', (list) => {
            return list.push(action.payload);
          });
        } else {
          state = state.setIn(['accounts', action.meta.index], action.payload);
        }

        if (action.meta.useAsCurrent) {
          state = state.set('accountCurrent', action.payload);
        }

        if (action.meta.clearOpened) {
          state = state.set('accountOpened', null);
        }
      }
      return state;

    case actionTypes.ACCOUNT_SHOW_DETAIL:
      state = state.setIn(['accounts', action.meta.index], action.payload);
      state = state.set('accountCurrent', action.payload);
      return state;

    case actionTypes.ACCOUNT_ADD_CHANGE_MEMBER_EMAIL:
      const member = accountUtils.getAccountMember(state.get('accountCurrent'), action.memberId);

      state = state.setIn(['accountCurrent', 'members', member[0], 'email'], action.email);
      return state;

    case actionTypes.ACCOUNT_TAP_DELETE:
      state = state.update('accounts', (list) => {
        return list.delete(state.get('accounts').indexOf(state.get('accountCurrent')));
      });

      state = state.set('accountCurrent', null);
      return state;

    case actionTypes.ROUTER_CHANGE_ROUTE:
      console.log('ROUTER_CHANGE_ROUTE', action.payload);

      const router = state.get('router');

      if (router) {
        // Mutation based on where we are now
        switch (router.routes[1].path) {
          case 'account/:id/edit':
            state = state.set('accountCurrent', null);
            state = state.set('accountOpened', null);
            break;

          case 'account/add':
          case 'account/:id/expense/:expenseId/edit':
          case 'account/:id/expense/add':
          case 'expense/add':
            state = state.set('accountCurrent', state.get('accountOpened'));
            state = state.set('accountOpened', null);
            break;
        }
      }

      // Mutation based on where we are going
      switch (action.payload.routes[1].path) {
        case undefined:
          state = state.set('accountCurrent', null);
          break;

        case 'account/:id/expenses':
          const id = API.accountAddPrefixId(action.payload.params.id);
          state = state.set('accountCurrent', state.get('accounts').find((account) => {
            return account.get('_id') === id;
          }));
          break;

        case 'account/add':
        case 'expense/add':
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
          break;

        case 'account/:id/edit':
        case 'account/:id/expense/add':
        case 'account/:id/expense/:expenseId/edit':
          state = state.set('accountOpened', state.get('accountCurrent'));
          break;
      }

      return state;

    case actionTypes.ACCOUNT_ADD_CHANGE_NAME:
      state = state.setIn(['accountCurrent', 'name'], action.name);
      return state;

    case actionTypes.ACCOUNT_ADD_TOGGLE_SHARE:
      state = state.setIn(['accountCurrent', 'share'], action.share);
      return state;

    case actionTypes.EXPENSE_CHANGE_RELATED_ACCOUNT:
      if (state.get('accountOpened') === null) {
        state = state.set('accountOpened', action.relatedAccount);
      }

      state = state.set('accountCurrent', action.relatedAccount);
      return state;

    case actionTypes.ACCOUNT_ADD_TAP_SAVE:
      let accountCurrent = action.payload.accountCurrent;
      accountCurrent = accountCurrent.set('dateUpdated', moment().unix());
      state = state.set('accountCurrent', accountCurrent);
      return state;

    default:
      return state;
  }
}

export default reducer;
