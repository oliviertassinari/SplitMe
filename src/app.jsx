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

analyticsTraker(); // Load
injectTapEventPlugin();

locale.load()
  .then(function() {
    if (process.env.NODE_ENV === 'development') {
      // var devToolsReact = require('redux-devtools/lib/react');
          // <devToolsReact.DebugPanel left={true} bottom={true} style={{
          //   height: 400,
          //   maxWidth: 400,
          // }}>
          //   <devToolsReact.DevTools store={store} monitor={devToolsReact.LogMonitor} />
          // </devToolsReact.DebugPanel>

      React.render(
        <div>
          <Provider store={store}>
            {function() {
              return <Main />;
            }}
          </Provider>
        </div>,
        document.getElementById('main'));
    } else {
      React.render(
        <Provider store={store}>
          {function() {
            return <Main />;
          }}
        </Provider>,
        document.getElementById('main'));
    }

  });
