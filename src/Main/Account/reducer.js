'use strict';

var Immutable = require('immutable');
var utils = require('utils');

function reducer(state, action) {
  switch (action.type) {
    case 'ACCOUNT_FETCH_ALL':
      if (!action.error) {
        state = state.set('accounts', action.payload);
      }
      return state;

    case 'ACCOUNT_REPLACE_ACCOUNT':
      if (!action.error) {
        if (action.meta.index === -1) {
          state = state.update('accounts', function(list) {
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

    case 'ACCOUNT_TAP_LIST':
      if (action.payload) {
        state = state.setIn(['accounts', action.meta.index], action.payload);
        state = state.set('accountCurrent', action.payload);
      } else {
        state = state.set('accountCurrent', action.account);
      }
      return state;

    case 'ACCOUNT_ADD_CHANGE_MEMBER_EMAIL':
      var member = utils.getAccountMember(state.get('accountCurrent'), action.memberId);

      state = state.setIn(['accountCurrent', 'members', member[0], 'email'], action.email);
      return state;

    case 'ACCOUNT_NAVIGATE_HOME':
      state = state.set('accountCurrent', null);
      return state;

    case 'ACCOUNT_TAP_SETTINGS':
      state = state.set('accountOpened', state.get('accountCurrent'));
      return state;

    case 'ACCOUNT_ADD_CHANGE_NAME':
      state = state.setIn(['accountCurrent', 'name'], action.name);
      return state;

    case 'ACCOUNT_ADD_TOGGLE_SHARE':
      state = state.setIn(['accountCurrent', 'share'], action.share);
      return state;

    case 'ACCOUNT_ADD_CLOSE':
      state = state.set('accountOpened', null);
      return state;

    case 'MODAL_TAP_OK':
      switch (action.triggerName) {
        case 'closeAccountAdd':
          state = state.set('accountCurrent', state.get('accountOpened'));
          state = state.set('accountOpened', null);
          break;
      }
      return state;

    case 'EXPENSE_CLOSE':
      state = state.set('accountCurrent', state.get('accountOpened'));
      state = state.set('accountOpened', null);
      return state;

    case 'EXPENSE_TAP_LIST':
    case 'ACCOUNT_TAP_ADD_EXPENSE_FOR_ACCOUNT':
      state = state.set('accountOpened', state.get('accountCurrent'));
      return state;

    case 'ACCOUNT_TAP_ADD_EXPENSE':
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
        couchDBDatabaseName: null,
      }));
      return state;

    case 'EXPENSE_CHANGE_RELATED_ACCOUNT':
      if (state.get('accountOpened') === null) {
        state = state.set('accountOpened', action.relatedAccount);
      }

      state = state.set('accountCurrent', action.relatedAccount);
      return state;

    default:
      return state;
  }
}

module.exports = reducer;
