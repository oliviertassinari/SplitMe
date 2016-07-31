// @flow weak

import React, {PropTypes, Component} from 'react';
import {Provider} from 'react-redux';
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
import locale from 'locale';
import routes from 'main/router/routes';
import facebookActions from 'main/facebook/actions';
import reducers from 'redux/reducers';
import crashMiddleware from 'redux/crashMiddleware';
import analyticsMiddleware from 'redux/analyticsMiddleware';
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
  window.devToolsExtension ? window.devToolsExtension() : (f) => f
)(createStore)(reducers);

// Sync dispatched route actions to the history
history = syncHistoryWithStore(history, store, {
  selectLocationState: (state) => state.get('routing'),
});

// To run the tests
window.tests = {
  history: history,
  store: store,
};

class Root extends Component {
  static propTypes = {
    locale: PropTypes.string.isRequired,
    styleManager: PropTypes.object.isRequired,
  };

  static childContextTypes = {
    locale: PropTypes.string.isRequired,
    styleManager: PropTypes.object.isRequired,
  };

  getChildContext() {
    return {
      locale: this.props.locale,
      styleManager: this.props.styleManager,
    };
  }

  componentWillMount() {
    locale.setCurrent(this.props.locale);
  }

  componentDidMount() {
    // Do less at the start
    setTimeout(() => {
      store.dispatch(facebookActions.updateLoginStatus());
    }, 500);
  }

  render() {
    return (
      <Provider store={store}>
        <Router history={history}>
          {routes}
        </Router>
      </Provider>
    );
  }
}

export default Root;
