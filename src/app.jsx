'use strict';

var React = require('react');
var injectTapEventPlugin = require("react-tap-event-plugin");

var API = require('./API');
var locale = require('./locale');
var Main = require('./Main/View');
var accountAction = require('./Main/Account/action');

injectTapEventPlugin();

locale.load().then(function() {
  React.render(<Main/>, document.getElementById('main'));
});

accountAction.fetchAll();

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  console.log('onDeviceReady');
  console.log('contacts', navigator.contacts);
}

// To run the tests
if (process.NODE_ENV !== 'production') {
  if(typeof window !== 'undefined') {
    window.tests = {
      API: API,
      expenseStore: require('./Main/Expense/store'),
    };
  }
}

// API.destroyAll();
