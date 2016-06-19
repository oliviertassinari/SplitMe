import React from 'react';
import {render} from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import API from 'API';
import locale from 'locale';
import createStyleManager from 'createStyleManager';
import Root from 'main/Root';
import {lasyLoad} from 'main/router/routes';
import pluginAnalytics from 'plugin/analytics';
import {AppContainer} from 'react-hot-loader';

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

const styleManager = createStyleManager();
const rootEl = document.getElementById('root');

Promise.all([
  locale.load(localeName),
  lazyLoadPromise,
])
  .then(() => {
    render(
      <AppContainer>
        <Root locale={localeName} styleManager={styleManager} />
      </AppContainer>,
      rootEl
    );
  });

window.onerror = function(message, url, line) {
  pluginAnalytics.trackException(`${message}|${url}|${line}`, true);
};

if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.accept('main/Root', () => {
    const NextRoot = require('main/Root').default;

    render(
      <AppContainer>
        <NextRoot locale={localeName} styleManager={styleManager} />
      </AppContainer>,
      rootEl
    );
  });
}
