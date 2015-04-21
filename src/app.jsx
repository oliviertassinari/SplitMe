'use strict';

var React = require('react/addons');
var injectTapEventPlugin = require("react-tap-event-plugin");

var API = require('./API');
var locale = require('./locale');
var Main = require('./Main/Main');
var accountAction = require('./Main/Account/action');
var pageAction = require('./Main/pageAction');
var pageStore = require('./Main/pageStore');

if (process.env.NODE_ENV !== 'production') {
  window.Perf = React.addons.Perf;

  window.addEventListener('keyup', function(event) {
    if (event.keyCode === 37) { // Left arrow
      pageAction.navigateBack();
    }
  });

  // To run the tests
  window.tests = {
    API: API,
    expenseStore: require('./Main/Expense/store'),
  };
}

document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
  document.addEventListener('backbutton', onBackButton, false);

  var analytics = window.analytics;
  analytics.startTrackerWithId('UA-44093216-2');

  analytics.trackView(pageStore.get());

  pageStore.addChangeListener(function() {
    analytics.trackView(pageStore.get());
  });
}

function onBackButton() {
  pageAction.navigateBack();
}

// API.destroyAll();

locale.load().then(function() {
  injectTapEventPlugin();
  React.render(<Main/>, document.getElementById('main'));
});

accountAction.fetchAll();
