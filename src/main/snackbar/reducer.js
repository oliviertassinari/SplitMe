import Immutable from 'immutable';
import actionTypes from 'redux/actionTypes';

function reducer(state, action) {
  const {
    type,
  } = action;

  if (state === undefined) {
    state = Immutable.fromJS({
      open: false,
      message: '',
    });
  }

  switch (type) {
    case actionTypes.ACCOUNT_ADD_TAP_SAVE:
      state = state.set('open', true);
      state = state.set('message', 'account_add_saved');
      return state;

    case actionTypes.EXPENSE_ADD_TAP_SAVE:
      state = state.set('open', true);
      state = state.set('message', 'expense_saved');
      return state;

    case actionTypes.ACCOUNT_DETAIL_TAP_DELETE:
      state = state.set('open', true);
      state = state.set('message', 'account_deleted');
      return state;

    case actionTypes.EXPENSE_ADD_TAP_DELETE:
      state = state.set('open', true);
      state = state.set('message', 'expense_deleted');
      return state;

    case actionTypes.SNACKBAR_DISMISS:
      state = state.set('open', false);
      return state;

    default:
      return state;
  }
}

export default reducer;
