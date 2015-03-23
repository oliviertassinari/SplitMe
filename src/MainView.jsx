'use strict';

var React = require('react');
var _ = require('underscore');

var pageStore = require('./pageStore');
var router = require('./router');
var API = require('./API');

var action = require('./action');
var accountStore = require('./Account/store');
var AccountList = require('./Account/ListView');
var AccountDetail = require('./Account/DetailView');

var expenseStore = require('./Expense/store');
var ExpenseAdd = require('./Expense/AddView');

function getState() {
  return {
    accounts: accountStore.getAll(),
    accountCurrent: accountStore.getCurrent(),
    expenseCurrent: expenseStore.getCurrent(),
    page: pageStore.get(),
    pageDialog: pageStore.getDialog(),
  };
}

var MainView = React.createClass({
  getInitialState: function() {
    return getState();
  },
  componentDidMount: function() {
    var self = this;

    router.on('/', function() {
      action.navigateHome();
    });

    router.on('/add', function() {
      action.navigateAddExpense();
    });

    router.on('/account/:accountId', function(accountId) {
      API.fetchAccount(accountId).then(function(account) {
        action.navigateAccount(account);
      });
    });

    _.each([accountStore, pageStore, expenseStore], function(store) {
      store.addChangeListener(self._onChange);
    });
  },
  componentWillUnmount: function() {
    var self = this;

    _.each([accountStore, pageStore, expenseStore], function(store) {
      store.removeChangeListener(self._onChange);
    });
  },
  _onChange: function() {
    this.setState(getState());
  },
  render: function() {
    var layout;
    var dialogRoute = '';

    if (this.state.pageDialog !== '') {
      dialogRoute = '/' + this.state.pageDialog;
    }

    switch(this.state.page) {
      case 'home':
        router.setRoute('/' + dialogRoute);
        break;

      case 'addExpense':
        router.setRoute('/add' + dialogRoute);
        break;

      case 'accountDetail':
        router.setRoute('/account/' + this.state.accountCurrent._id + dialogRoute);
        break;

      case 'editExpense':
        router.setRoute('/account/' + this.state.accountCurrent._id + '/edit' + dialogRoute);
        break;
    }

    switch(this.state.page) {
      case 'home':
        layout = <AccountList accounts={this.state.accounts} />;
        break;

      case 'addExpense':
      case 'editExpense':
        layout = <ExpenseAdd expense={this.state.expenseCurrent}
                  pageDialog={this.state.pageDialog} />;
        break;

      case 'accountDetail':
        layout = <AccountDetail account={this.state.accountCurrent} />;
        break;
    }

    return layout;
  },
});

module.exports = MainView;
