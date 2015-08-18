'use strict';

var redux = require('redux');
var thunk = require('redux');
var promiseMiddleware = require('redux-promise');

var createStoreWithMiddleware = redux.applyMiddleware(
  promiseMiddleware,
  thunk
)(redux.createStore);

var accountReducer = require('Main/Account/reducer');
var expenseReducer = require('Main/Expense/reducer');

var reducersCombined = redux.combineReducers({
  couchdb: require('Main/CouchDB/reducer'),
  facebook: require('Main/Facebook/reducer'),
  modal: require('Main/Modal/reducer'),
  screen: require('Main/Screen/reducer'),
});

var reducers = function(state, action) {
  var state = accountReducer(state, action);
  state = expenseReducer(state, action);
  state = reducersCombined(state, action);

  return state;
}

var store = createStoreWithMiddleware(reducers);

module.exports = store;
