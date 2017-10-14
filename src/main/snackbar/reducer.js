import Immutable from 'immutable';
import actionTypes from 'redux/actionTypes';
import polyglot from 'polyglot';

const stateInit = Immutable.fromJS({
  open: false,
  message: '',
  action: undefined,
  onActionTouchTap: undefined,
});

function snackbarReducer(state, action) {
  const { type, payload, error } = action;

  if (state === undefined) {
    state = stateInit;
  }

  // Generic error handling.
  if (error) {
    if (!payload) {
      return state;
    }

    let errorMessage;

    if (payload.reason) {
      errorMessage = payload.reason;
    } else if (typeof payload.message === 'string') {
      errorMessage = payload.message;
    }

    if (errorMessage === undefined) {
      return state;
    }

    state = stateInit;
    state = state.set('open', true);
    state = state.set('message', polyglot.t('snackbar_error', { message: errorMessage }));
    return state;
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
      state = stateInit;
      state = state.set('open', true);
      state = state.set('message', payload.message);
      state = state.set('action', payload.action);
      state = state.set('onActionTouchTap', payload.onActionTouchTap);
      return state;

    case actionTypes.SETTINGS_TAP_IMPORTED:
      state = stateInit;
      state = state.set('open', true);
      state = state.set('message', polyglot.t('import_success'));
      return state;

    case actionTypes.SNACKBAR_DISMISS:
      state = stateInit;
      return state;

    default:
      return state;
  }
}

export default snackbarReducer;
