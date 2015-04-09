'use strict';

var React = require('react');
var moment = require('moment');
var injectTapEventPlugin = require("react-tap-event-plugin");

var API = require('./API');
var utils = require('./utils');
var locale = require('./locale');
var polyglot = require('./polyglot');
var Main = require('./Main/View');
var accountAction = require('./Main/Account/action');

injectTapEventPlugin();

var localeCurrent = locale.getCurrent();

// Load moment locale
window.moment = moment;

var script = document.createElement('script');
script.src = utils.baseUrl + '/locale/moment/' + localeCurrent + '.js';
document.body.appendChild(script);


locale.load().then(function(phrases) {
  polyglot.locale(localeCurrent);
  polyglot.extend(phrases);

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
