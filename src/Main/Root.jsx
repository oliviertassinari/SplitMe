import React from 'react';
import {Provider} from 'react-redux';
import {ReduxRouter} from 'redux-router';
import {StyleRoot} from 'radium';

import store from 'redux/store';
import routes from 'Main/routes';
import muiTheme from 'Main/muiTheme';
import facebookActions from 'Main/Facebook/actions';

require('Main/main.less');

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
          <ReduxRouter>
            {routes}
          </ReduxRouter>
        </StyleRoot>
      </Provider>
    );
  },
});

export default Root;
