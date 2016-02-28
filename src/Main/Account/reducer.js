import Immutable from 'immutable';
import moment from 'moment';
import {LOCATION_CHANGE} from 'react-router-redux';

import API from 'API';
import actionTypes from 'redux/actionTypes';
import accountUtils from 'Main/Account/utils';
import routesParser from 'Main/routesParser';

function reducer(state, action) {
  switch (action.type) {
    case actionTypes.ACCOUNT_FETCH_LIST:
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

    case actionTypes.EXPENSE_FETCH_ADD:
      state = state.update('accounts', (list) => {
        return list.push(action.payload.accountCurrent);
      });
      state = state.set('accountOpened', action.payload.accountCurrent);
      state = state.set('accountCurrent', action.payload.accountCurrent);
      return state;

    case actionTypes.ACCOUNT_FETCH_DETAIL:
      if (action.meta && typeof action.meta.index === 'number') {
        state = state.setIn(['accounts', action.meta.index], action.payload);
      } else {
        state = state.update('accounts', (list) => {
          return list.push(action.payload);
        });
      }

      state = state.set('accountCurrent', action.payload);
      return state;

    case actionTypes.ACCOUNT_ADD_FETCH_ADD:
      state = state.update('accounts', (list) => {
        return list.push(action.payload.account);
      });
      state = state.set('accountCurrent', action.payload.account);
      state = state.set('accountOpened', action.payload.account);
      return state;

    case actionTypes.ACCOUNT_ADD_CHANGE_MEMBER_EMAIL:
      const {
        memberId,
        email,
      } = action.payload;

      const member = accountUtils.getAccountMember(state.get('accountCurrent'), memberId);

      state = state.setIn(['accountCurrent', 'members', member[0], 'email'], email);
      return state;

    case actionTypes.ACCOUNT_TAP_DELETE:
      state = state.update('accounts', (list) => {
        return list.delete(state.get('accounts').indexOf(state.get('accountCurrent')));
      });

      state = state.set('accountCurrent', null);
      return state;

    case LOCATION_CHANGE:
      const location = state.get('routing').locationBeforeTransitions;

      if (location) {
        const pathnameCurrent = location.pathname;
        // Mutation based on where we are now
        if (routesParser.accountEdit.match(pathnameCurrent)) {
          state = state.set('accountCurrent', null);
          state = state.set('accountOpened', null);
        } else if (pathnameCurrent === '/account/add' ||
           pathnameCurrent === '/expense/add' ||
           routesParser.expenseAdd.match(pathnameCurrent) ||
           routesParser.expenseEdit.match(pathnameCurrent)
        ) {
          state = state.set('accountCurrent', state.get('accountOpened'));
          state = state.set('accountOpened', null);
        }
      }

      const pathnameNew = action.payload.pathname;

      // Mutation based on where we are going
      if (pathnameNew === undefined) {
        state = state.set('accountCurrent', null);
      } else if (pathnameNew === '/account/add' || pathnameNew === '/expense/add') {
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
      } else if (routesParser.accountDetail.match(pathnameNew)) {
        const id = API.accountAddPrefixId(routesParser.accountDetail.match(pathnameNew).id);
        state = state.set('accountCurrent', state.get('accounts').find((account) => {
          return account.get('_id') === id;
        }));
      } else if (routesParser.accountEdit.match(pathnameNew)) {
        const id = API.accountAddPrefixId(routesParser.accountEdit.match(pathnameNew).id);
        state = state.set('accountCurrent', state.get('accounts').find((account) => {
          return account.get('_id') === id;
        }));

        state = state.set('accountOpened', state.get('accountCurrent'));
      } else if (routesParser.expenseAdd.match(pathnameNew)) {
        state = state.set('accountOpened', state.get('accountCurrent'));
      } else if (routesParser.expenseEdit.match(pathnameNew)) {
        const id = API.accountAddPrefixId(routesParser.expenseEdit.match(pathnameNew).id);
        state = state.set('accountCurrent', state.get('accounts').find((account) => {
          return account.get('_id') === id;
        }));

        state = state.set('accountOpened', state.get('accountCurrent'));
      }

      return state;

    case actionTypes.ACCOUNT_ADD_CHANGE_NAME:
      state = state.setIn(['accountCurrent', 'name'], action.payload.name);
      return state;

    case actionTypes.ACCOUNT_ADD_TOGGLE_SHARE:
      state = state.setIn(['accountCurrent', 'share'], action.payload.share);
      return state;

    case actionTypes.EXPENSE_CHANGE_RELATED_ACCOUNT:
      const relatedAccount = action.payload.relatedAccount;
      if (state.get('accountOpened') === null) {
        state = state.set('accountOpened', relatedAccount);
      }

      state = state.set('accountCurrent', relatedAccount);
      return state;

    case actionTypes.ACCOUNT_ADD_TAP_SAVE:
      let accountCurrent = action.payload.accountCurrent;
      accountCurrent = accountCurrent.set('dateUpdated', moment().unix());
      state = state.set('accountCurrent', accountCurrent);
      return state;

    case actionTypes.EXPENSE_ADD_MEMBER:
      state = state.updateIn(['accountCurrent', 'members'], (list) => {
        return list.push(action.payload.member);
      });
      return state;

    default:
      return state;
  }
}

export default reducer;
