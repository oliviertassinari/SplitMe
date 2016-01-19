import React from 'react';
import {Provider} from 'react-redux';
import {StyleRoot} from 'radium';
import {
  createStore,
  applyMiddleware,
  compose,
} from 'redux';
import {syncHistory} from 'redux-simple-router';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise';
import {createMemoryHistory} from 'history';
import {RoutingContext} from 'react-router';

import locale from 'locale';
import muiTheme from 'Main/muiTheme';
import reducers from 'redux/reducers';

const history = createMemoryHistory();

// Sync dispatched route actions to the history
const reduxRouterMiddleware = syncHistory(history);

const middleware = applyMiddleware(
  promiseMiddleware,
  thunk,
  reduxRouterMiddleware,
);

const store = compose(
  middleware,
)(createStore)(reducers);

const Root = React.createClass({
  propTypes: {
    locale: React.PropTypes.string,
    router: React.PropTypes.object,
  },
  childContextTypes: {
    muiTheme: React.PropTypes.object,
  },
  getChildContext() {
    return {
      muiTheme: muiTheme,
    };
  },
  componentWillMount() {
    locale.setCurrent(this.props.locale);
  },
  render() {
    return (
      <Provider store={store}>
        <StyleRoot>
          <RoutingContext {...this.props.router} />
        </StyleRoot>
      </Provider>
    );
  },
});

export default Root;
