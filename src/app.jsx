'use strict';

var React = require('react/addons');
var injectTapEventPlugin = require("react-tap-event-plugin");

var API = require('./API');
var locale = require('./locale');
var Main = require('./Main/Main');
var accountAction = require('./Main/Account/action');
var pageAction = require('./Main/pageAction');
var expenseAction = require('./Main/Expense/action');
var pageStore = require('./Main/pageStore');
var analyticsTraker = require('./analyticsTraker');

// API.destroyAll();

if (process.env.NODE_ENV !== 'production') {
  window.Perf = React.addons.Perf;

  window.addEventListener('keyup', function(event) {
    if (event.keyCode === 37) { // Left arrow
      onBackButton();
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

  analyticsTraker.onDeviceReady();
}

function onBackButton() {
  var page = pageStore.get();

  if (pageStore.getDialog() === '') {
    switch (page) {
      case 'addExpense':
      case 'addExpenseForAccount':
      case 'editExpense':
        expenseAction.navigateBack(page);
        break;

      case 'accountDetail':
        accountAction.navigateBack();
        break;

      default:
        pageAction.navigateBack();
        break;
    }
  } else {
    pageAction.navigateBack();
  }
}

locale.load().then(function() {
  injectTapEventPlugin();
  React.render(<Main/>, document.getElementById('main'));
});

accountAction.fetchAll();
