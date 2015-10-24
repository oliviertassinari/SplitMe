'use strict';

const React = require('react');
const {Provider} = require('react-redux');
const {ReduxRouter} = require('redux-router');

const store = require('redux/store');
const routes = require('Main/routes');
const muiTheme = require('Main/muiTheme');
const accountActions = require('Main/Account/actions');
const facebookActions = require('Main/Facebook/actions');

require('Main/main.less');

store.dispatch(accountActions.showList());

// Do less at the start
setTimeout(() => {
  store.dispatch(facebookActions.updateLoginStatus());
}, 1000);

const Root = React.createClass({
  childContextTypes: {
    muiTheme: React.PropTypes.object,
  },
  getChildContext() {
    return {
      muiTheme: muiTheme,
    };
  },
  render() {
    return (
      <Provider store={store}>
        <ReduxRouter>
          {routes}
        </ReduxRouter>
      </Provider>
    );
  },
});

module.exports = Root;
