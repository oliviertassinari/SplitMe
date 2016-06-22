import Immutable from 'immutable';
import actionTypes from 'redux/actionTypes';
import polyglot from 'polyglot';

const stateInit = Immutable.fromJS({
  open: false,
  message: '',
  action: undefined,
  onActionTouchTap: undefined,
});

function reducer(state, action) {
  const {
    type,
    payload,
  } = action;

  if (state === undefined) {
    state = stateInit;
  }

  switch (type) {
    case actionTypes.ACCOUNT_ADD_TAP_SAVE:
      state = stateInit;
      state = state.set('open', true);
      state = state.set('message', polyglot.t('account_add_saved'));
      return state;

    case actionTypes.EXPENSE_ADD_TAP_SAVE:
      state = stateInit;
      state = state.set('open', true);
      state = state.set('message', polyglot.t('expense_saved'));
      return state;

    case actionTypes.ACCOUNT_DETAIL_DELETE_CONFIRM:
      state = stateInit;
      state = state.set('open', true);
      state = state.set('message', polyglot.t('account_deleted'));
      return state;

    case actionTypes.EXPENSE_ADD_DELETE_CONFIRM:
      state = stateInit;
      state = state.set('open', true);
      state = state.set('message', polyglot.t('expense_deleted'));
      return state;

    case actionTypes.SNACKBAR_SHOW:
      state = state.set('open', true);
      state = state.set('message', payload.message);
      state = state.set('action', payload.action);
      state = state.set('onActionTouchTap', payload.onActionTouchTap);
      return state;

    case actionTypes.SNACKBAR_DISMISS:
      state = stateInit;
      return state;

    default:
      return state;
  }
}

export default reducer;
