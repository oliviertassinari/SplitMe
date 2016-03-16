import Immutable from 'immutable';
import actionTypes from 'redux/actionTypes';

function reducer(state, action) {
  if (state === undefined) {
    state = Immutable.fromJS({
      open: false,
      message: '',
    });
  }

  switch (action.type) {
    case actionTypes.ACCOUNT_ADD_TAP_SAVE:
      state = state.set('open', true);
      state = state.set('message', 'account_add_saved');
      return state;

    case actionTypes.EXPENSE_TAP_SAVE:
      state = state.set('open', true);
      state = state.set('message', 'expense_saved');
      return state;

    case actionTypes.ACCOUNT_TAP_DELETE:
      state = state.set('open', true);
      state = state.set('message', 'account_deleted');
      return state;

    case actionTypes.EXPENSE_TAP_DELETE:
      state = state.set('open', true);
      state = state.set('message', 'expense_deleted');
      return state;

    case actionTypes.SNACKBAR_open:
      state = state.set('open', true);
      state = state.set('message', action.message);
      return state;

    case actionTypes.SNACKBAR_DISMISS:
      state = state.set('open', false);
      return state;

    default:
      return state;
  }
}

export default reducer;
