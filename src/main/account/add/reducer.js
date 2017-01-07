// @flow weak

import Immutable from 'immutable';
import moment from 'moment';
import actionTypes from 'redux/actionTypes';
import accountUtils from 'main/account/utils';

const stateInit = Immutable.fromJS({
  allowExit: true,
  current: null,
  fetched: false,
  opened: null,
  closing: false,
});

function accountAddReducer(state, action) {
  const {
    type,
    payload,
    error,
  } = action;

  if (state === undefined) {
    state = stateInit;
  }

  switch (type) {
    case actionTypes.ACCOUNT_ADD_FETCH: {
      state = state.set('fetched', true);

      if (error) {
        return state;
      }

      let account;

      if (payload && payload.account) {
        account = payload.account;
      } else {
        account = Immutable.fromJS({
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
        });
      }

      state = state.set('opened', account);
      state = state.set('current', account);
      return state;
    }

    case actionTypes.ACCOUNT_ADD_CHANGE_NAME:
      state = state.set('allowExit', false);
      state = state.setIn(['current', 'name'], payload.name);
      return state;

    case actionTypes.ACCOUNT_ADD_CHANGE_MEMBER_EMAIL: {
      state = state.set('allowExit', false);
      const {
        memberId,
        email,
      } = payload;

      const member = accountUtils.getMemberEntry(state.get('current'), memberId);

      state = state.setIn(['current', 'members', member[0], 'email'], email);
      return state;
    }

    case actionTypes.ACCOUNT_ADD_ADD_MEMBER:
      state = state.set('allowExit', false);
      state = state.updateIn(['current', 'members'], (list) => {
        return list.push(action.payload.member);
      });
      return state;

    case actionTypes.ACCOUNT_ADD_TOGGLE_SHARE:
      state = state.set('allowExit', false);
      state = state.setIn(['current', 'share'], payload.share);
      return state;

    case actionTypes.ACCOUNT_ADD_TAP_SAVE:
      if (!error) {
        state = state.set('allowExit', true);
        state = state.update('current', (current) => {
          return current.set('dateUpdated', moment().unix());
        });
      }
      return state;

    case actionTypes.ACCOUNT_ADD_TAP_CLOSE:
      state = state.set('allowExit', true);
      state = state.set('closing', true);
      return state;

    case actionTypes.ACCOUNT_ADD_UNMOUNT:
      state = stateInit;
      return state;

    default:
      return state;
  }
}

export default accountAddReducer;
