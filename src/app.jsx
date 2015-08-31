'use strict';

var React = require('react/addons');
var injectTapEventPlugin = require('react-tap-event-plugin');
var Provider = require('react-redux').Provider;

var store = require('redux/store');
var API = require('API');
var locale = require('locale');
var Main = require('Main/Main');
var analyticsTraker = require('analyticsTraker');

// API.destroyAll();
API.setUpDataBase();

if (process.env.NODE_ENV === 'development') {
  window.Perf = React.addons.Perf;

  window.addEventListener('keyup', function(event) {
    if (event.keyCode === 37) { // Left arrow
      document.dispatchEvent(new Event('backbutton'));
    }
  });

  // To run the tests
  window.tests = {
    API: API,
    fixtureBrowser: require('../test/fixtureBrowser'),
    immutable: require('immutable'),
  };
}

analyticsTraker();
injectTapEventPlugin();

locale.load()
  .then(function() {
    React.render(
      <Provider store={store}>
        {function() {
          return <Main />;
        }}
      </Provider>,
      document.getElementById('main'));
  });
