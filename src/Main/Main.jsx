'use strict';

const React = require('react');
const {connect} = require('react-redux');
const Immutable = require('immutable');

const muiTheme = require('Main/muiTheme');
const AccountList = require('Main/Account/List');
const AccountDetail = require('Main/Account/Detail');
const AccountAdd = require('Main/Account/Add/Add');
const Modal = require('Main/Modal/Modal');
const Snackbar = require('Main/Snackbar/Snackbar');
const ExpenseAdd = require('Main/Expense/Add');
const Settings = require('Main/Settings/Settings');
const accountActions = require('Main/Account/actions');
const facebookActions = require('Main/Facebook/actions');

require('Main/main.less');

const Main = React.createClass({
  propTypes: {
    dispatch: React.PropTypes.func.isRequired,
    state: React.PropTypes.instanceOf(Immutable.Map).isRequired,
  },
  childContextTypes: {
    muiTheme: React.PropTypes.object,
  },
  getChildContext() {
    return {
      muiTheme: muiTheme,
    };
  },
  componentDidMount() {
    this.props.dispatch(accountActions.fetchAll());

    // Do less at the start
    setTimeout(() => {
      this.props.dispatch(facebookActions.updateLoginStatus());
    }, 1000);
  },
  render() {
    const state = this.props.state;
    let layout;

    switch (state.getIn(['screen', 'page'])) {
      case 'home':
        layout = <AccountList accounts={state.get('accounts')} snackbarShow={state.getIn(['snackbar', 'show'])} />;
        break;

      case 'addExpense':
      case 'addExpenseForAccount':
      case 'editExpense':
        layout = (
          <ExpenseAdd account={state.get('accountCurrent')} accounts={state.get('accounts')}
            expense={state.get('expenseCurrent')} pageDialog={state.getIn(['screen', 'dialog'])} />
        );
        break;

      case 'accountDetail':
      case 'accountDetailBalance':
      case 'accountDetailDebts':
        layout = (
          <AccountDetail account={state.get('accountCurrent')} page={state.getIn(['screen', 'page'])}
            snackbarShow={state.getIn(['snackbar', 'show'])} />
        );
        break;

      case 'accountAdd':
        layout = <AccountAdd account={state.get('accountCurrent')} />;
        break;

      case 'settings':
        layout = (
          <Settings facebook={state.get('facebook')} pageDialog={state.getIn(['screen', 'dialog'])}
            couchdb={state.get('couchdb')} />
        );
        break;
    }

    return (
      <div>
        {layout}
        <Modal show={state.getIn(['screen', 'dialog']) === 'modal'} modal={state.get('modal')} />
        <Snackbar snackbar={state.get('snackbar')} />
      </div>
    );
  },
});

function mapStateToProps(state) {
  return {
    state: state,
  };
}

module.exports = connect(mapStateToProps)(Main);
