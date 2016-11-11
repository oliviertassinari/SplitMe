// @flow weak

import React, { PropTypes, Component } from 'react';
import { Provider } from 'react-redux';
import MuiThemeProvider from 'material-ui-build-next/src/styles/MuiThemeProvider';
import {
  Router,
  browserHistory,
  createMemoryHistory,
} from 'react-router';
import {
  createStore,
  applyMiddleware,
  compose,
} from 'redux';
import {
  syncHistoryWithStore,
  routerMiddleware,
} from 'react-router-redux';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise';
import routes from 'main/router/routes';
import facebookActions from 'main/facebook/actions';
import reducers from 'redux/reducers';
import crashMiddleware from 'redux/crashMiddleware';
import analyticsMiddleware from 'modules/analytics/middleware';
import browsingMetrics from 'modules/analytics/browsingMetrics';
import locale from 'locale';
import 'main/main.css';

let history;

if (process.env.PLATFORM === 'android' || process.env.PLATFORM === 'ios') {
  history = createMemoryHistory();
} else {
  history = browserHistory;
}

let middlewares;

if (process.env.NODE_ENV === 'development') {
  middlewares = [
    promiseMiddleware,
    thunk,
    crashMiddleware, // TO REMOVE
    routerMiddleware(history),
    analyticsMiddleware,
  ];

  if (!window.devToolsExtension) {
    const loggerMiddleware = require('redux/loggerMiddleware').default;

    middlewares = [
      ...middlewares,
      loggerMiddleware,
    ];
  }
} else {
  middlewares = [
    promiseMiddleware,
    thunk,
    crashMiddleware,
    routerMiddleware(history),
    analyticsMiddleware,
  ];
}

const store = compose(
  applyMiddleware(...middlewares),
  window.devToolsExtension ? window.devToolsExtension() : (f) => f,
)(createStore)(reducers);

// Sync dispatched route actions to the history
history = syncHistoryWithStore(history, store, {
  selectLocationState: (state) => state.get('routing'),
});

// To run the tests
window.tests = {
  history,
  store,
};

class Root extends Component {
  static propTypes = {
    locale: PropTypes.string.isRequired,
    styleManager: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
  };

  static childContextTypes = {
    locale: PropTypes.string.isRequired,
  };

  getChildContext() {
    return {
      locale: this.props.locale,
    };
  }

  componentWillMount() {
    locale.setCurrent(this.props.locale);
  }

  componentDidMount() {
    // Measure the first paint timing.
    browsingMetrics();

    setTimeout(() => {
      // Do less at the start.
      store.dispatch(facebookActions.updateLoginStatus());

      // Remove server-side generated style tag in order to avoid side-effects.
      const jssStyles = document.getElementById('jss-server-side');
      if (jssStyles.parentNode) {
        jssStyles.parentNode.removeChild(jssStyles);
      }
    }, 3000);
  }

  render() {
    const {
      theme,
      styleManager,
    } = this.props;

    return (
      <Provider store={store}>
        <MuiThemeProvider theme={theme} styleManager={styleManager}>
          <Router history={history}>
            {routes}
          </Router>
        </MuiThemeProvider>
      </Provider>
    );
  }
}

export default Root;
