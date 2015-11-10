import {
  createStore,
  applyMiddleware,
  compose,
} from 'redux';
import {
  reduxReactRouter,
  routerStateReducer,
} from 'redux-router';
import thunk from 'redux-thunk';
import {createHashHistory} from 'history';
import promiseMiddleware from 'redux-promise';
import Immutable from 'immutable';

import routes from 'Main/routes';
import accountReducer from 'Main/Account/reducer';
import expenseReducer from 'Main/Expense/reducer';
import couchdbReducer from 'Main/CouchDB/reducer';
import facebookReducer from 'Main/Facebook/reducer';
import modalReducer from 'Main/Modal/reducer';
import screenReducer from 'Main/Screen/reducer';
import snackbarReducer from 'Main/Snackbar/reducer';
import crashReporter from 'redux/crashReporter';
import analytics from 'redux/analytics';

let middleware;

if (process.env.NODE_ENV === 'development') {
  const logger = store => next => action => {
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
    analytics,
    logger
  );
} else {
  middleware = applyMiddleware(
    promiseMiddleware,
    crashReporter,
    thunk,
    analytics
  );
}

const finalCreateStore = compose(
  middleware,
  reduxReactRouter({
    routes: routes,
    createHistory: createHashHistory,
  })
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
    mutatable.set('router', routerStateReducer(mutatable.get('router'), action));

    return mutatable;
  });

  state.router = state.get('router');

  return state;
};

const store = finalCreateStore(reducers);

export default store;
