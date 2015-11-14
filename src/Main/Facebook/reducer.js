import Immutable from 'immutable';

import actionTypes from 'redux/actionTypes';

function reducer(state, action) {
  if (state === undefined) {
    state = new Immutable.Map();
  }

  switch (action.type) {
    case actionTypes.FACEBOOK_LOGIN:
    case actionTypes.FACEBOOK_UPDATE_LOGIN_STATUS:
      if (!action.error) {
        state = Immutable.fromJS(action.payload);
      }
      return state;

    case actionTypes.FACEBOOK_UPDATE_ME_INFO:
      if (!action.error) {
        state = state.set('me', Immutable.fromJS(action.payload));
      }
      return state;

    default:
      return state;
  }
}

export default reducer;
