'use strict';

var React = require('react');
var _ = require('underscore');
var ThemeManager = require('material-ui/lib/styles/theme-manager');

var pageStore = require('Main/pageStore');
var accountStore = require('Main/Account/store');
var AccountList = require('Main/Account/List');
var AccountDetail = require('Main/Account/Detail');
var AccountAdd = require('Main/Account/Add/Add');
var Modal = require('Main/Modal/Modal');
var modalStore = require('Main/Modal/store');
var expenseStore = require('Main/Expense/store');
var ExpenseAdd = require('Main/Expense/Add');
var Settings = require('Main/Settings/Settings');
var facebookStore = require('Main/Facebook/store');
var couchDBStore = require('Main/CouchDB/store');
var theme = require('Main/theme');

require('Main/main.less');

var themeManager = new ThemeManager();
themeManager.setTheme(theme);

function getState() {
  return {
    accounts: accountStore.getAll(),
    accountCurrent: accountStore.getCurrent(),
    expenseCurrent: expenseStore.getCurrent(),
    page: pageStore.get(),
    pageDialog: pageStore.getDialog(),
    modal: modalStore.getModal(),
    facebook: facebookStore.get(),
    couchDB: couchDBStore.get(),
  };
}

var Main = React.createClass({
  childContextTypes: {
    muiTheme: React.PropTypes.object,
  },
  getChildContext: function() {
    return {
      muiTheme: themeManager.getCurrentTheme(),
    };
  },
  getInitialState: function() {
    return getState();
  },
  componentDidMount: function() {
    var self = this;

    _.each([
        accountStore,
        pageStore,
        expenseStore,
        modalStore,
        facebookStore,
        couchDBStore,
      ], function(store) {
        store.addChangeListener(self._onChange);
      });
  },
  componentWillUnmount: function() {
    var self = this;

    _.each([
        accountStore,
        pageStore,
        expenseStore,
        modalStore,
        facebookStore,
        couchDBStore,
      ], function(store) {
        store.removeChangeListener(self._onChange);
      });
  },
  _onChange: function() {
    this.setState(getState());
  },
  render: function() {
    var layout;
    var state = this.state;

    switch(state.page) {
      case 'home':
        layout = <AccountList accounts={state.accounts} />;
        break;

      case 'addExpense':
      case 'addExpenseForAccount':
      case 'editExpense':
        layout = <ExpenseAdd account={state.accountCurrent} expense={state.expenseCurrent}
                  pageDialog={state.pageDialog} />;
        break;

      case 'accountDetail':
      case 'accountDetailBalance':
      case 'accountDetailDebts':
        layout = <AccountDetail account={state.accountCurrent} page={state.page} />;
        break;

      case 'accountAdd':
        layout = <AccountAdd account={state.accountCurrent} />;
        break;

      case 'settings':
        layout = <Settings facebook={state.facebook} />;
        break;
    }

    return <div>
        {layout}
        <Modal pageDialog={state.pageDialog} actions={state.modal.actions}
          title={state.modal.title} />
      </div>;
  },
});

module.exports = Main;
