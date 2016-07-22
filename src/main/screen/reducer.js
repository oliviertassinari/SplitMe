// @flow weak

import Immutable from 'immutable';
import actionTypes from 'redux/actionTypes';

function reducer(state, action) {
  const {
    type,
    payload,
  } = action;

  if (state === undefined) {
    state = Immutable.fromJS({
      dialog: '',
    });
  }

  switch (type) {
    case actionTypes.MODAL_UPDATE:
      state = state.set('dialog', 'modal');
      return state;

    case actionTypes.SCREEN_SHOW_DIALOG:
      state = state.set('dialog', payload.name);
      return state;

    case actionTypes.MODAL_DISMISS:
    case actionTypes.SCREEN_DISMISS_DIALOG:
    case actionTypes.EXPENSE_ADD_CHANGE_PAID_BY:
    case actionTypes.EXPENSE_ADD_CHANGE_RELATED_ACCOUNT:
      state = state.set('dialog', '');
      return state;

    case actionTypes.EXPENSE_ADD_ADD_MEMBER:
      if (payload.useAsPaidBy) {
        state = state.set('dialog', '');
      }
      return state;

    default:
      return state;
  }
}

export default reducer;
