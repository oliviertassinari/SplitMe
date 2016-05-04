import React from 'react';
import {render} from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import API from 'API';
import locale from 'locale';
import Root from 'main/Root';
import {lasyLoad} from 'main/routes';
import pluginAnalytics from 'plugin/analytics';

// API.destroyAll();
API.setUpDataBase();

if (process.env.PLATFORM === 'browser' && process.env.NODE_ENV !== 'production') {
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
window.tests = Object.assign({}, window.tests, {
  API: API,
  fixtureBrowser: fixtureBrowser,
  immutable: Immutable,
});

injectTapEventPlugin();

const localeName = locale.getBestLocale();

const lazyLoadPromise = new Promise((resolve) => {
  let lazyRouteName;

  if (process.env.PLATFORM === 'android') {
    lazyRouteName = 'AccountList';
  } else {
    lazyRouteName = window.LAZY_ROUTE_NAME;
  }

  lasyLoad(lazyRouteName)(resolve);
});

Promise.all([
  locale.load(localeName),
  lazyLoadPromise,
])
  .then(() => {
    render(<Root locale={localeName} />, document.getElementById('main'));
  });

window.onerror = function(message, url, line) {
  pluginAnalytics.trackException(`${message}|${url}|${line}`, true);
};
