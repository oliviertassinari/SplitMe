import Immutable from 'immutable';
import {routerReducer} from 'react-router-redux';

import accountReducer from 'main/account/reducer';
import accountAddReducer from 'main/account/add/reducer';
import expenseAddReducer from 'main/expense/add/reducer';
import couchdbReducer from 'main/couchDB/reducer';
import facebookReducer from 'main/facebook/reducer';
import modalReducer from 'main/modal/reducer';
import screenReducer from 'main/screen/reducer';
import snackbarReducer from 'main/snackbar/reducer';

const reducers = (state, action) => {
  if (state === undefined) {
    state = Immutable.fromJS({
      accounts: [],
      isAccountsFetched: false,
    });
  }

  state = state.withMutations((mutatable) => {
    mutatable = accountReducer(mutatable, action);
    mutatable.set('expenseAdd', expenseAddReducer(mutatable.get('expenseAdd'), action));
    mutatable.set('accountAdd', accountAddReducer(mutatable.get('accountAdd'), action));
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
