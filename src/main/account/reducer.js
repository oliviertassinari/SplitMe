import Immutable from 'immutable';

import actionTypes from 'redux/actionTypes';

function reducer(state, action) {
  const {
    type,
    payload,
    meta,
    error,
  } = action;

  if (state === undefined) {
    state = Immutable.fromJS({
      accounts: [],
      isAccountsFetched: false,
    });
  }

  switch (type) {
    case actionTypes.ACCOUNT_FETCH_LIST:
      if (!error) {
        state = state.set('accounts', payload);
        state = state.set('isAccountsFetched', true);
      }
      return state;

    case actionTypes.ACCOUNT_REPLACE_ACCOUNT:
      if (!error) {
        if (meta.index === -1) {
          state = state.update('accounts', (list) => {
            return list.push(payload);
          });
        } else {
          state = state.setIn(['accounts', meta.index], payload);
        }
      }
      return state;

    case actionTypes.ACCOUNT_DETAIL_FETCH:
      state = state.setIn(['accounts', meta.index], payload);
      return state;

    case actionTypes.ACCOUNT_DETAIL_TAP_DELETE:
      state = state.update('accounts', (list) => {
        return list.delete(payload.accountIndex);
      });
      return state;

    default:
      return state;
  }
}

export default reducer;
