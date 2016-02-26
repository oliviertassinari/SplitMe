import React from 'react';
import {Provider} from 'react-redux';
import {
  createStore,
  applyMiddleware,
  compose,
} from 'redux';
import {syncHistory} from 'react-router-redux';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise';
import {
  RouterContext,
  createMemoryHistory,
} from 'react-router';

import locale from 'locale';
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

class Root extends React.Component {
  static propTypes = {
    locale: React.PropTypes.string,
    router: React.PropTypes.object,
  };

  componentWillMount() {
    locale.setCurrent(this.props.locale);
  }

  render() {
    return (
      <Provider store={store}>
        <RouterContext {...this.props.router} />
      </Provider>
    );
  }
}

export default Root;
