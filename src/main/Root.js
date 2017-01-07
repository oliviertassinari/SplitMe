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
import analytics from 'modules/analytics/analytics';
import analyticsMiddleware from 'modules/analytics/middleware';
import metricsMiddleware from 'browser-metrics/lib/reduxMetricsMiddleware';
import browsingMetrics from 'browser-metrics/lib/browsingMetrics';
import locale from 'locale';
import 'main/main.css';

let history;

if (process.env.PLATFORM === 'android' || process.env.PLATFORM === 'ios') {
  history = createMemoryHistory();
} else {
  history = browserHistory;
}

let middlewares = [
  promiseMiddleware,
  thunk,
  crashMiddleware,
  routerMiddleware(history),
  analyticsMiddleware,
  metricsMiddleware({
    trackTiming: analytics.trackTiming,
  }),
];

/* eslint-disable no-underscore-dangle */
const composeEnhancers = (process.env.NODE_ENV !== 'production' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
/* eslint-enable no-underscore-dangle */

if (process.env.NODE_ENV === 'development' && composeEnhancers === compose) {
  const loggerMiddleware = require('redux-logger');

  middlewares = [
    ...middlewares,
    loggerMiddleware({
      stateTransformer: (state) => state.toJS(),
    }),
  ];
}

const store = composeEnhancers(
  applyMiddleware(...middlewares),
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
    browsingMetrics({
      trackTiming: analytics.trackTiming,
    });

    setTimeout(() => {
      // Do less at the start.
      store.dispatch(facebookActions.updateLoginStatus());

      // Remove server-side generated style tag in order to avoid side-effects.
      if (process.env.PLATFORM === 'browser') {
        const jssStyles = document.getElementById('jss-server-side');
        if (jssStyles.parentNode) {
          jssStyles.parentNode.removeChild(jssStyles);
        }
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
