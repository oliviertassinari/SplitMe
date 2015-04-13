'use strict';

var React = require('react/addons');
var injectTapEventPlugin = require("react-tap-event-plugin");

var API = require('./API');
var locale = require('./locale');
var Main = require('./Main/Main');
var accountAction = require('./Main/Account/action');

// API.destroyAll();

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
    window.Perf = React.addons.Perf;

    window.tests = {
      API: API,
      expenseStore: require('./Main/Expense/store'),
    };
  }
}

