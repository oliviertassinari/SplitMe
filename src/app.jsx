'use strict';

var React = require('react/addons');
var injectTapEventPlugin = require('react-tap-event-plugin');

var API = require('API');
var locale = require('locale');
var Main = require('Main/Main');
var analyticsTraker = require('analyticsTraker');
var accountAction = require('Main/Account/action');

// API.destroyAll();
API.setUpDataBase();

if (process.env.NODE_ENV !== 'production') {
  window.Perf = React.addons.Perf;

  window.addEventListener('keyup', function(event) {
    if (event.keyCode === 37) { // Left arrow
      document.dispatchEvent(new Event('backbutton'));
    }
  });

  // To run the tests
  window.tests = {
    API: API,
    expenseStore: require('./Main/Expense/store'),
  };
}

function onDeviceReady() {
  analyticsTraker.onDeviceReady();
}

document.addEventListener('deviceready', onDeviceReady, false);

injectTapEventPlugin();

locale.load().then(function() {
  React.render(<Main/>, document.getElementById('main'));
});

accountAction.fetchAll();
