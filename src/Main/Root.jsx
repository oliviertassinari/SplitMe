import React from 'react';
import {Provider} from 'react-redux';
import {StyleRoot} from 'radium';
import {Router} from 'react-router';
import {
  createStore,
  applyMiddleware,
  compose,
} from 'redux';
import {syncHistory} from 'redux-simple-router';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise';
import {createHashHistory} from 'history';

import routes from 'Main/routes';
import muiTheme from 'Main/muiTheme';
import facebookActions from 'Main/Facebook/actions';
import reducers from 'redux/reducers';
import crashMiddleware from 'redux/crashMiddleware';
import loggerMiddleware from 'redux/loggerMiddleware';

require('Main/main.less');

const history = createHashHistory();

// Sync dispatched route actions to the history
const reduxRouterMiddleware = syncHistory(history);

let middleware;

if (process.env.NODE_ENV === 'development') {
  middleware = applyMiddleware(
    promiseMiddleware,
    thunk,
    reduxRouterMiddleware,
    // analyticsMiddleware,
    loggerMiddleware
  );
} else {
  middleware = applyMiddleware(
    promiseMiddleware,
    crashMiddleware,
    thunk,
    reduxRouterMiddleware,
    // analyticsMiddleware
  );
}

const store = compose(
  middleware,
)(createStore)(reducers);

// Sync store to history
reduxRouterMiddleware.listenForReplays(store, (state) => state.get('routing'));

// To run the tests
window.store = store;

const Root = React.createClass({
  childContextTypes: {
    muiTheme: React.PropTypes.object,
  },
  getChildContext() {
    return {
      muiTheme: muiTheme,
    };
  },
  componentDidMount() {
    // Do less at the start
    setTimeout(() => {
      store.dispatch(facebookActions.updateLoginStatus());
    }, 200);
  },
  render() {
    return (
      <Provider store={store}>
        <StyleRoot>
          <Router history={history}>
            {routes}
          </Router>
        </StyleRoot>
      </Provider>
    );
  },
});

export default Root;
