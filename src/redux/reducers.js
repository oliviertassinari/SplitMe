import Immutable from 'immutable';
import {routerReducer} from 'react-router-redux';

import accountReducer from 'main/account/reducer';
import expenseReducer from 'main/expense/reducer';
import couchdbReducer from 'main/couchDB/reducer';
import facebookReducer from 'main/facebook/reducer';
import modalReducer from 'main/modal/reducer';
import screenReducer from 'main/screen/reducer';
import snackbarReducer from 'main/snackbar/reducer';

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
