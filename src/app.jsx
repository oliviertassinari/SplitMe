'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const injectTapEventPlugin = require('react-tap-event-plugin');

const API = require('API');
const locale = require('locale');
const Root = require('Main/Root');
const analyticsTraker = require('analyticsTraker');

// API.destroyAll();
API.setUpDataBase();

if (PLATFORM === 'browser') {
  const LEFT_ARROW = 37;

  // Simulate android backbutton
  window.addEventListener('keyup', (event) => {
    if (event.keyCode === LEFT_ARROW) {
      document.dispatchEvent(new Event('backbutton'));
    }
  });
}

if (process.env.NODE_ENV === 'development') {
  window.Perf = require('react-addons-perf');
}

// To run the tests
window.tests = {
  API: API,
  fixtureBrowser: require('../test/fixtureBrowser'),
  immutable: require('immutable'),
};

analyticsTraker();
injectTapEventPlugin();

locale.load()
  .then(() => {
    ReactDOM.render(
      <Root />,
      document.getElementById('main'));
  });
