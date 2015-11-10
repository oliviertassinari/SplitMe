import Immutable from 'immutable';
import actionTypes from 'redux/actionTypes';

function reducer(state, action) {
  if (state === undefined) {
    state = Immutable.fromJS({
      show: false,
      message: '',
      actionMessage: null,
      actionTouchTap: null,
    });
  }

  switch (action.type) {
    case actionTypes.ACCOUNT_ADD_TAP_SAVE:
      state = state.set('show', true);
      state = state.set('message', 'account_add_saved');
      return state;

    case actionTypes.EXPENSE_TAP_SAVE:
      state = state.set('show', true);
      state = state.set('message', 'expense_saved');
      return state;

    case actionTypes.ACCOUNT_TAP_DELETE:
      state = state.set('show', true);
      state = state.set('message', 'account_deleted');
      return state;

    case actionTypes.EXPENSE_TAP_DELETE:
      state = state.set('show', true);
      state = state.set('message', 'expense_deleted');
      return state;

    case actionTypes.SNACKBAR_SHOW:
      state = state.set('show', true);
      state = state.set('message', action.message);
      state = state.set('actionMessage', action.actionMessage);
      state = state.set('actionTouchTap', action.actionTouchTap);
      return state;

    case actionTypes.SNACKBAR_DISMISS:
      state = state.set('show', false);
      return state;

    default:
      return state;
  }
}

export default reducer;
