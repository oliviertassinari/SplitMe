'use strict';

var redux = require('redux');
var thunk = require('redux-thunk');
var promiseMiddleware = require('redux-promise');
var Immutable = require('immutable');

var accountReducer = require('Main/Account/reducer');
var expenseReducer = require('Main/Expense/reducer');
var couchdbReducer = require('Main/CouchDB/reducer');
var facebookReducer = require('Main/Facebook/reducer');
var modalReducer = require('Main/Modal/reducer');
var screenReducer = require('Main/Screen/reducer');
var crashReporter = require('crashReporter');

var middleware;

if (process.env.NODE_ENV === 'development') {
  var logger = function(store) {
    return function(next) {
      return function(action) {
        console.group(action.type);
        console.debug('dispatching', action);
        var result = next(action);
        console.debug('next state', store.getState().toJS());
        console.groupEnd(action.type);
        return result;
      };
    };
  };

  middleware = redux.applyMiddleware(
    promiseMiddleware,
    thunk,
    logger,
    crashReporter
  );
} else {
  middleware = redux.applyMiddleware(
    promiseMiddleware,
    thunk,
    crashReporter
  );
}

var finalCreateStore = redux.compose(
  middleware,
  redux.createStore
);

var reducers = function(state, action) {
  if (state === undefined) {
    state = Immutable.fromJS({
      accounts: [],
    });
  }

  var state = state.withMutations(function(mutatable) {
    mutatable = accountReducer(mutatable, action);
    mutatable = expenseReducer(mutatable, action);
    mutatable.set('couchdb', couchdbReducer(mutatable.get('couchdb'), action));
    mutatable.set('facebook', facebookReducer(mutatable.get('facebook'), action));
    mutatable.set('modal', modalReducer(mutatable.get('modal'), action));
    mutatable.set('screen', screenReducer(mutatable.get('screen'), action));

    return mutatable;
  });

  return state;
};

var store = finalCreateStore(reducers);

module.exports = store;
