import Immutable from 'immutable';
import moment from 'moment';

import actionTypes from 'redux/actionTypes';
import accountUtils from 'main/account/utils';

function reducer(state, action) {
  const {
    type,
    payload,
    error,
  } = action;

  if (state === undefined) {
    state = Immutable.fromJS({
      fetched: false,
      opened: null,
      current: null,
    });
  }

  switch (type) {
    case actionTypes.ACCOUNT_ADD_FETCH:
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

    case actionTypes.ACCOUNT_ADD_CHANGE_NAME:
      state = state.setIn(['current', 'name'], payload.name);
      return state;

    case actionTypes.ACCOUNT_ADD_CHANGE_MEMBER_EMAIL:
      const {
        memberId,
        email,
      } = payload;

      const member = accountUtils.getMemberEntry(state.get('current'), memberId);

      state = state.setIn(['current', 'members', member[0], 'email'], email);
      return state;

    case actionTypes.ACCOUNT_ADD_ADD_MEMBER:
      state = state.updateIn(['current', 'members'], (list) => {
        return list.push(action.payload.member);
      });
      return state;

    case actionTypes.ACCOUNT_ADD_TOGGLE_SHARE:
      state = state.setIn(['current', 'share'], payload.share);
      return state;

    case actionTypes.ACCOUNT_ADD_TAP_SAVE:
      state = state.update('current', (current) => {
        return current.set('dateUpdated', moment().unix());
      });
      return state;

    case actionTypes.ACCOUNT_ADD_UNMOUNT:
      state = state.set('fetched', false);
      state = state.set('opened', null);
      state = state.set('current', null);
      return state;

    default:
      return state;
  }
}

export default reducer;
