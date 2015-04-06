'use strict';

var React = require('react');
var moment = require('moment');
var injectTapEventPlugin = require("react-tap-event-plugin");

var API = require('./API');
var utils = require('./utils');
var locale = require('./locale');
var polyglot = require('./polyglot');
var MainView = require('./MainView');
var accountAction = require('./Account/action');

injectTapEventPlugin();

var localeCurrent = locale.getCurrent();
loadLocaleMoment(localeCurrent);

locale.load().then(function(phrases) {
  polyglot.locale(localeCurrent);
  polyglot.extend(phrases);

  React.render(<MainView/>, document.getElementById('main'));
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
      expenseStore: require('./Expense/store'),
    };
  }
}

function loadLocaleMoment(localeCurrent) {
  window.moment = moment;

  var script = document.createElement('script');
  script.src = utils.baseUrl + '/locale/moment/' + localeCurrent + '.js';
  document.body.appendChild(script);
}

// API.destroyAll();
