// @flow weak

import Immutable from 'immutable';
import actionTypes from 'redux/actionTypes';

function accountReducer(state, action) {
  const {
    type,
    payload,
    meta,
    error,
  } = action;

  if (state === undefined) {
    state = Immutable.fromJS({
      accounts: {
        status: 'idle',
        payload: [],
      },
    });
  }

  switch (type) {
    case actionTypes.ACCOUNT_FETCH_LIST:
      if (error) {
        state = state.setIn(['accounts', 'status'], 'error');
      } else {
        state = state.setIn(['accounts', 'status'], 'success');
        state = state.setIn(['accounts', 'payload'], payload);
      }
      return state;

    case actionTypes.ACCOUNT_REPLACE_ACCOUNT:
      if (!error) {
        if (meta.index === -1) {
          state = state.updateIn(['accounts', 'payload'], (list) => {
            return list.push(payload);
          });
        } else {
          state = state.setIn(['accounts', 'payload', meta.index], payload);
        }
      }
      return state;

    case actionTypes.ACCOUNT_DETAIL_FETCH:
      if (!error && payload) {
        state = state.setIn(['accounts', 'payload', meta.index], payload);
      }
      return state;

    case actionTypes.ACCOUNT_DETAIL_DELETE_CONFIRM:
      state = state.updateIn(['accounts', 'payload'], (list) => {
        return list.delete(payload.accountIndex);
      });
      return state;

    default:
      return state;
  }
}

export default accountReducer;
