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
var analyticsTraker = require('analyticsTraker');

var finalCreateStore;
var middleware = redux.applyMiddleware(
  promiseMiddleware,
  thunk,
  analyticsTraker.crashReporter
);

if (process.env.NODE_ENV === 'development') {
  // var devTools = require('redux-devtools');

  finalCreateStore = redux.compose(
    middleware,
    // devTools.devTools(),
    redux.createStore
  );
} else {
  finalCreateStore = redux.compose(
    middleware,
    redux.createStore
  );
}

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
