'use strict';

var React = require('react');

var API = require('./API');
var polyglot = require('./polyglot');

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


var httpRequest = new XMLHttpRequest();
httpRequest.onreadystatechange = function() {
  if (this.readyState === 4 && this.status === 200) {
    polyglot.extend(JSON.parse(this.responseText));
    console.log(polyglot);
  }
};
httpRequest.open('GET', 'locale/en.json');
httpRequest.send();
