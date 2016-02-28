import Immutable from 'immutable';
import {routerReducer} from 'react-router-redux';

import accountReducer from 'Main/Account/reducer';
import expenseReducer from 'Main/Expense/reducer';
import couchdbReducer from 'Main/CouchDB/reducer';
import facebookReducer from 'Main/Facebook/reducer';
import modalReducer from 'Main/Modal/reducer';
import screenReducer from 'Main/Screen/reducer';
import snackbarReducer from 'Main/Snackbar/reducer';

const reducers = (state, action) => {
  if (state === undefined) {
    state = Immutable.fromJS({
      accounts: [],
      accountCurrent: null,
      accountOpened: null,
      isAccountsFetched: false,
      expenseCurrent: null,
      expenseOpened: null,
    });
  }

  state = state.withMutations((mutatable) => {
    mutatable = accountReducer(mutatable, action);
    mutatable = expenseReducer(mutatable, action);
    mutatable.set('couchdb', couchdbReducer(mutatable.get('couchdb'), action));
    mutatable.set('facebook', facebookReducer(mutatable.get('facebook'), action));
    mutatable.set('modal', modalReducer(mutatable.get('modal'), action));
    mutatable.set('screen', screenReducer(mutatable.get('screen'), action));
    mutatable.set('snackbar', snackbarReducer(mutatable.get('snackbar'), action));
    mutatable.set('routing', routerReducer(mutatable.get('routing'), action));

    return mutatable;
  });

  return state;
};

export default reducers;
