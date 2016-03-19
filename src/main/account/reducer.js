import actionTypes from 'redux/actionTypes';

function reducer(state, action) {
  const {
    type,
    payload,
    meta,
    error,
  } = action;

  switch (type) {
    case actionTypes.ACCOUNT_FETCH_LIST:
      if (!error) {
        state = state.set('accounts', payload);
        state = state.set('isAccountsFetched', true);
      }
      return state;

    case actionTypes.ACCOUNT_FETCH_DETAIL:
      state = state.setIn(['accounts', meta.index], payload);
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

    case actionTypes.ACCOUNT_TAP_DELETE:
      state = state.update('accounts', (list) => {
        return list.delete(payload.accountIndex);
      });
      return state;

    default:
      return state;
  }
}

export default reducer;
