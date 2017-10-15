import React from 'react';
import { render, hydrate } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Immutable from 'immutable';
import API from 'API';
import locale from 'locale';
import crashReporter from 'modules/crashReporter/crashReporter';
import Root from 'main/Root';
import { lasyLoad } from 'main/router/routes';
import fixtureBrowser from '../test/fixtureBrowser';

// API.destroyDb();
API.setUpDataBase();

if (process.env.PLATFORM === 'browser' && process.env.NODE_ENV !== 'production') {
  const LEFT_ARROW = 37;

  // Simulate android backbutton
  window.addEventListener('keyup', event => {
    if (event.keyCode === LEFT_ARROW) {
      document.dispatchEvent(new Event('backbutton'));
    }
  });
}

// To run the tests
window.tests = Object.assign({}, window.tests, {
  API,
  fixtureBrowser,
  immutable: Immutable,
});

injectTapEventPlugin();

const localeName = locale.getBestLocale();

const lazyLoadPromise = new Promise(resolve => {
  let lazyRouteName;

  if (process.env.PLATFORM === 'android' || process.env.PLATFORM === 'ios') {
    lazyRouteName = 'AccountList';
  } else {
    lazyRouteName = window.LAZY_ROUTE_NAME;
  }

  lasyLoad(lazyRouteName)(resolve);
});

const rootEl = document.querySelector('#root');

Promise.all([locale.load(localeName), lazyLoadPromise]).then(() => {
  hydrate(
    <AppContainer>
      <Root locale={localeName} />
    </AppContainer>,
    rootEl,
  );

  crashReporter.init();
});

if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.accept('main/Root', () => {
    render(
      <AppContainer>
        <Root locale={localeName} />
      </AppContainer>,
      rootEl,
    );
  });
}
