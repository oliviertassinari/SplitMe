// @flow weak

import Immutable from 'immutable';
import actionTypes from 'redux/actionTypes';

function accountDetailReducer(state, action) {
  const {
    type,
  } = action;

  if (state === undefined) {
    state = Immutable.fromJS({
      fetched: false,
      deleting: false,
    });
  }

  switch (type) {
    case actionTypes.ACCOUNT_DETAIL_FETCH:
      state = state.set('fetched', true);
      return state;

    case actionTypes.ACCOUNT_DETAIL_TAP_DELETE:
      state = state.set('deleting', true);
      return state;

    case actionTypes.ACCOUNT_DETAIL_UNMOUNT:
      state = state.set('fetched', false);
      state = state.set('deleting', false);
      return state;

    default:
      return state;
  }
}

export default accountDetailReducer;
