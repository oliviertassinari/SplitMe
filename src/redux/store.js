import {
  createStore,
  applyMiddleware,
  compose,
} from 'redux';
import {syncHistory, routeReducer} from 'redux-simple-router';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise';
import Immutable from 'immutable';

import historySingleton from 'historySingleton';
import accountReducer from 'Main/Account/reducer';
import expenseReducer from 'Main/Expense/reducer';
import couchdbReducer from 'Main/CouchDB/reducer';
import facebookReducer from 'Main/Facebook/reducer';
import modalReducer from 'Main/Modal/reducer';
import screenReducer from 'Main/Screen/reducer';
import snackbarReducer from 'Main/Snackbar/reducer';
import crashMiddleware from 'redux/crashMiddleware';
import analyticsMiddleware from 'redux/analyticsMiddleware';

// Sync dispatched route actions to the history
const reduxRouterMiddleware = syncHistory(historySingleton);

let middleware;

if (process.env.NODE_ENV === 'development') {
  const loggerMiddleware = store => next => action => {
    console.group(action.type);
    console.debug('dispatching', action);
    const result = next(action);
    console.debug('next state', store.getState().toJS());
    console.groupEnd(action.type);
    return result;
  };

  middleware = applyMiddleware(
    promiseMiddleware,
    thunk,
    reduxRouterMiddleware,
    // analyticsMiddleware,
    loggerMiddleware
  );
} else {
  middleware = applyMiddleware(
    promiseMiddleware,
    crashMiddleware,
    thunk,
    reduxRouterMiddleware,
    // analyticsMiddleware
  );
}

const finalCreateStore = compose(
  middleware,
)(createStore);

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
    mutatable.set('routing', routeReducer(mutatable.get('routing'), action));

    return mutatable;
  });

  // Wait https://github.com/rackt/redux-simple-router/issues/193 to be solved
  analyticsMiddleware({
    getState: () => state,
  })(() => {})(action);

  return state;
};

const store = finalCreateStore(reducers);

// Sync store to history
reduxRouterMiddleware.listenForReplays(store, (state) => state.get('routing'));

export default store;
