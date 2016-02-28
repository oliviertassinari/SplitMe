import React from 'react';
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
import routes from 'Main/routes';
import facebookActions from 'Main/Facebook/actions';
import reducers from 'redux/reducers';
import crashMiddleware from 'redux/crashMiddleware';
import loggerMiddleware from 'redux/loggerMiddleware';
import analyticsMiddleware from 'redux/analyticsMiddleware';

require('Main/main.less');

let history;

if (process.env.PLATFORM === 'android') {
  history = createMemoryHistory();
} else {
  history = browserHistory;
}

let middleware;

if (process.env.NODE_ENV === 'development') {
  middleware = applyMiddleware(
    promiseMiddleware,
    thunk,
    routerMiddleware(history),
    analyticsMiddleware,
    loggerMiddleware
  );
} else {
  middleware = applyMiddleware(
    promiseMiddleware,
    crashMiddleware,
    thunk,
    routerMiddleware(history),
    analyticsMiddleware
  );
}

const store = compose(
  middleware,
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

class Root extends React.Component {
  static propTypes = {
    locale: React.PropTypes.string,
    router: React.PropTypes.object,
  };

  componentWillMount() {
    locale.setCurrent(this.props.locale);
  }

  componentDidMount() {
    // Do less at the start
    setTimeout(() => {
      store.dispatch(facebookActions.updateLoginStatus());
    }, 200);
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
