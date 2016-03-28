import Immutable from 'immutable';

import actionTypes from 'redux/actionTypes';

function reducer(state, action) {
  const {
    type,
  } = action;

  if (state === undefined) {
    state = Immutable.fromJS({
      fetched: false,
    });
  }

  switch (type) {
    case actionTypes.ACCOUNT_DETAIL_FETCH:
      state = state.set('fetched', true);
      return state;

    case actionTypes.ACCOUNT_DETAIL_UNMOUNT:
      state = state.set('fetched', false);
      return state;

    default:
      return state;
  }
}

export default reducer;
