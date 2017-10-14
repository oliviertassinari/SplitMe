
import React, { PropTypes, Component } from 'react';
import { Provider } from 'react-redux';
import MuiThemeProvider from 'material-ui-build-next/src/styles/MuiThemeProvider';
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
    locale: PropTypes.string.isRequired,
    router: PropTypes.object,
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

  render() {
    const {
      theme,
      styleManager,
      router,
    } = this.props;

    return (
      <Provider store={store}>
        <MuiThemeProvider theme={theme} styleManager={styleManager}>
          <RouterContext {...router} />
        </MuiThemeProvider>
      </Provider>
    );
  }
}

export default Root;
