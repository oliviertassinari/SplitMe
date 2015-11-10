import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import API from 'API';
import locale from 'locale';
import Root from 'Main/Root';
import pluginAnalytics from 'plugin/analytics';

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

injectTapEventPlugin();

locale.load()
  .then(() => {
    ReactDOM.render(
      <Root />,
      document.getElementById('main'));
  });

window.onerror = function(message, url, line) {
  pluginAnalytics.trackException(message + '|' + url + '|' + line, true);
};
