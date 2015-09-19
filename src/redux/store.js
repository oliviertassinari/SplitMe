'use strict';

const redux = require('redux');
const thunk = require('redux-thunk');
const promiseMiddleware = require('redux-promise');
const Immutable = require('immutable');

const accountReducer = require('Main/Account/reducer');
const expenseReducer = require('Main/Expense/reducer');
const couchdbReducer = require('Main/CouchDB/reducer');
const facebookReducer = require('Main/Facebook/reducer');
const modalReducer = require('Main/Modal/reducer');
const screenReducer = require('Main/Screen/reducer');
const snackbarReducer = require('Main/Snackbar/reducer');
const crashReporter = require('crashReporter');

let middleware;

if (process.env.NODE_ENV === 'development') {
  const logger = function(store) {
    return function(next) {
      return function(action) {
        console.group(action.type);
        console.debug('dispatching', action);
        const result = next(action);
        console.debug('next state', store.getState().toJS());
        console.groupEnd(action.type);
        return result;
      };
    };
  };

  middleware = redux.applyMiddleware(
    promiseMiddleware,
    crashReporter,
    thunk,
    logger
  );
} else {
  middleware = redux.applyMiddleware(
    promiseMiddleware,
    crashReporter,
    thunk
  );
}

const finalCreateStore = redux.compose(
  middleware
)(redux.createStore);

const reducers = function(state, action) {
  if (state === undefined) {
    state = Immutable.fromJS({
      accounts: [],
    });
  }

  state = state.withMutations(function(mutatable) {
    mutatable = accountReducer(mutatable, action);
    mutatable = expenseReducer(mutatable, action);
    mutatable.set('couchdb', couchdbReducer(mutatable.get('couchdb'), action));
    mutatable.set('facebook', facebookReducer(mutatable.get('facebook'), action));
    mutatable.set('modal', modalReducer(mutatable.get('modal'), action));
    mutatable.set('screen', screenReducer(mutatable.get('screen'), action));
    mutatable.set('snackbar', snackbarReducer(mutatable.get('snackbar'), action));

    return mutatable;
  });

  return state;
};

const store = finalCreateStore(reducers);

module.exports = store;
