import React, {PropTypes, Component} from 'react';
import {Provider} from 'react-redux';
import {
  createStore,
  applyMiddleware,
  compose,
} from 'redux';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise';
import {
  RouterContext,
} from 'react-router';

import locale from 'locale';
import reducers from 'redux/reducers';

const middleware = applyMiddleware(
  promiseMiddleware,
  thunk,
);

const store = compose(
  middleware,
)(createStore)(reducers);

class Root extends Component {
  static propTypes = {
    locale: PropTypes.string,
    router: PropTypes.object,
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
