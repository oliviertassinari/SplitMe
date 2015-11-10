'use strict';

const {
  createStore,
  applyMiddleware,
  compose,
} = require('redux');
const {
  reduxReactRouter,
  routerStateReducer,
} = require('redux-router');
const thunk = require('redux-thunk');
const {createHashHistory} = require('history');
const promiseMiddleware = require('redux-promise');
const Immutable = require('immutable');

const routes = require('Main/routes');
const accountReducer = require('Main/Account/reducer');
const expenseReducer = require('Main/Expense/reducer');
const couchdbReducer = require('Main/CouchDB/reducer');
const facebookReducer = require('Main/Facebook/reducer');
const modalReducer = require('Main/Modal/reducer');
const screenReducer = require('Main/Screen/reducer');
const snackbarReducer = require('Main/Snackbar/reducer');
const crashReporter = require('redux/crashReporter');
const analytics = require('redux/analytics');

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

module.exports = store;
