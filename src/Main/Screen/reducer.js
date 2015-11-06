'use strict';

const Immutable = require('immutable');
const actionTypes = require('redux/actionTypes');

function reducer(state, action) {
  if (state === undefined) {
    state = Immutable.fromJS({
      page: 'home',
      dialog: '',
    });
  }

  switch (action.type) {
    case actionTypes.MODAL_UPDATE:
      state = state.set('dialog', 'modal');
      return state;

    case actionTypes.SCREEN_SHOW_DIALOG:
      state = state.set('dialog', action.name);
      return state;

    case actionTypes.MODAL_DISMISS:
    case actionTypes.SCREEN_DISMISS_DIALOG:
    case actionTypes.EXPENSE_CHANGE_PAID_BY:
    case actionTypes.EXPENSE_CHANGE_RELATED_ACCOUNT:
    case actionTypes.COUCHDB_TAP_IMPORTED:
      state = state.set('dialog', '');
      return state;

    case actionTypes.COUCHDB_TAP_IMPORT:
      state = state.set('dialog', 'import');
      return state;

    case actionTypes.COUCHDB_TAP_EXPORT:
      state = state.set('dialog', 'export');
      return state;

    case actionTypes.EXPENSE_PICK_CONTACT:
      if (action.useAsPaidBy) {
        state = state.set('dialog', '');
      }
      return state;

    default:
      return state;
  }
}

module.exports = reducer;
