'use strict';

var React = require('react');

var API = require('./API');

// API.destroyAll();

var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

var MainView = require('./MainView');
var accountAction = require('./Account/action');

React.render(<MainView/>, document.getElementById('main'));

accountAction.fetchAll();

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  console.log('onDeviceReady');
  console.log(navigator.contacts);
}

if (process.NODE_ENV !== 'production') {
  if(typeof window !== 'undefined') {
    window.tests = {
      API: API,
      expenseStore: require('./Expense/store'),
    };
  }
}
