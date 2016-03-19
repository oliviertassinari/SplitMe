import Immutable from 'immutable';
import moment from 'moment';

import actionTypes from 'redux/actionTypes';
import accountUtils from 'main/account/utils';

function reducer(state, action) {
  const {
    type,
    payload,
  } = action;

  if (state === undefined) {
    state = Immutable.fromJS({
      opened: null,
      current: null,
    });
  }

  switch (type) {
    case actionTypes.ACCOUNT_ADD_FETCH_ADD:
      if (payload && payload.account) {
        state = state.set('opened', payload.account);
        state = state.set('current', payload.account);
      } else {
        state = state.set('opened', null);
        state = state.set('current', Immutable.fromJS({
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

    default:
      return state;
  }
}

export default reducer;
