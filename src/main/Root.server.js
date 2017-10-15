import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { MuiThemeProvider } from 'material-ui-next/styles';
import MuiThemeProviderOld from 'material-ui/styles/MuiThemeProvider';
import JssProvider from 'react-jss/lib/JssProvider';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise';
import { RouterContext } from 'react-router';
import reducers from 'redux/reducers';
import locale from 'locale';

const middleware = applyMiddleware(promiseMiddleware, thunk);

const store = compose(middleware)(createStore)(reducers);

class Root extends Component {
  static propTypes = {
    locale: PropTypes.string.isRequired,
    router: PropTypes.object,
    styleContext: PropTypes.object.isRequired,
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
    const { styleContext, router } = this.props;

    return (
      <Provider store={store}>
        <JssProvider registry={styleContext.sheetsRegistry} jss={styleContext.jss}>
          <MuiThemeProvider theme={styleContext.theme} sheetsManager={styleContext.sheetsManager}>
            <MuiThemeProviderOld muiTheme={styleContext.muiTheme}>
              <RouterContext {...router} />
            </MuiThemeProviderOld>
          </MuiThemeProvider>
        </JssProvider>
      </Provider>
    );
  }
}

export default Root;
