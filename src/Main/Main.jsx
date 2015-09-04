'use strict';

var React = require('react');
var ThemeManager = require('material-ui/lib/styles/theme-manager');
var connect = require('react-redux').connect;
var Immutable = require('immutable');

var theme = require('Main/theme');
var AccountList = require('Main/Account/List');
var AccountDetail = require('Main/Account/Detail');
var AccountAdd = require('Main/Account/Add/Add');
var Modal = require('Main/Modal/Modal');
var ExpenseAdd = require('Main/Expense/Add');
var Settings = require('Main/Settings/Settings');
var accountActions = require('Main/Account/actions');
var facebookActions = require('Main/Facebook/actions');

require('Main/main.less');

var themeManager = new ThemeManager();
themeManager.setTheme(theme);

var Main = React.createClass({
  propTypes: {
    dispatch: React.PropTypes.func.isRequired,
    state: React.PropTypes.instanceOf(Immutable.Map).isRequired,
  },
  childContextTypes: {
    muiTheme: React.PropTypes.object,
  },
  getChildContext: function() {
    return {
      muiTheme: themeManager.getCurrentTheme(),
    };
  },
  componentDidMount: function() {
    var dispatch = this.props.dispatch;

    dispatch(accountActions.fetchAll());

    // Do less at the start
    setTimeout(function() {
      dispatch(facebookActions.updateLoginStatus());
    }, 1000);
  },
  render: function() {
    var layout;
    var state = this.props.state;

    switch (state.getIn(['screen', 'page'])) {
      case 'home':
        layout = <AccountList accounts={state.get('accounts')} />;
        break;

      case 'addExpense':
      case 'addExpenseForAccount':
      case 'editExpense':
        layout = <ExpenseAdd account={state.get('accountCurrent')} accounts={state.get('accounts')}
          expense={state.get('expenseCurrent')} pageDialog={state.getIn(['screen', 'dialog'])} />;
        break;

      case 'accountDetail':
      case 'accountDetailBalance':
      case 'accountDetailDebts':
        layout = <AccountDetail account={state.get('accountCurrent')} page={state.getIn(['screen', 'page'])} />;
        break;

      case 'accountAdd':
        layout = <AccountAdd account={state.get('accountCurrent')} />;
        break;

      case 'settings':
        layout = <Settings facebook={state.get('facebook')} pageDialog={state.getIn(['screen', 'dialog'])}
          couchdb={state.get('couchdb')} />;
        break;
    }

    return <div>
        {layout}
        <Modal show={state.getIn(['screen', 'dialog']) === 'modal'} modal={state.get('modal')} />
      </div>;
  },
});

function mapStateToProps(state) {
  return {
    state: state,
  };
}

module.exports = connect(mapStateToProps)(Main);
