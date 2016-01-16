import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import API from 'API';
import locale from 'locale';
import Root from 'Main/Root';
import pluginAnalytics from 'plugin/analytics';

// API.destroyAll();
API.setUpDataBase();

if (process.env.PLATFORM === 'browser') {
  const LEFT_ARROW = 37;

  // Simulate android backbutton
  window.addEventListener('keyup', (event) => {
    if (event.keyCode === LEFT_ARROW) {
      document.dispatchEvent(new Event('backbutton'));
    }
  });
}

if (process.env.NODE_ENV !== 'production') {
  window.Perf = require('react-addons-perf');
}

import fixtureBrowser from '../test/fixtureBrowser';
import Immutable from 'immutable';

// To run the tests
window.tests = {
  API: API,
  fixtureBrowser: fixtureBrowser,
  immutable: Immutable,
};

injectTapEventPlugin();

const localName = locale.getBestLocale();

locale.load(localName)
  .then(() => {
    locale.setCurrent(localName);

    ReactDOM.render(
      <Root />,
      document.getElementById('main'));
  });

window.onerror = function(message, url, line) {
  pluginAnalytics.trackException(message + '|' + url + '|' + line, true);
};
