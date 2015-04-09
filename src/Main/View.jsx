'use strict';

var React = require('react');
var _ = require('underscore');

var router = require('../router');
var API = require('../API');
var pageStore = require('./pageStore');

var action = require('./action');
var accountStore = require('./Account/store');
var AccountList = require('./Account/List');
var AccountDetail = require('./Account/Detail');

var expenseStore = require('./Expense/store');
var ExpenseAdd = require('./Expense/Add');

require('./style.less');

function getState() {
  return {
    accounts: accountStore.getAll(),
    accountCurrent: accountStore.getCurrent(),
    expenseCurrent: expenseStore.getCurrent(),
    page: pageStore.get(),
    pageDialog: pageStore.getDialog(),
  };
}

function getAccount(accountId, accountCurrent) {
  // TODO : use accountCurrent to improve perfs
  return API.fetchAccount(accountId);
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
      action.navigateExpenseAdd();
    });

    router.param('accountId', /((\d{4})-(\d{2})-(\d{2})T(\d{2})\:(\d{2})\:(\d{2}).(\d{3})Z)/);

    router.path('/account/:accountId', function () {
      this.on('', function (accountId) {
        getAccount(accountId, self.state.accountCurrent).then(function(account) {
          action.navigateAccount(account);
        });
      });

      this.on(/edit/, function (accountId) {
        getAccount(accountId, self.state.accountCurrent).then(function(account) {
          action.navigateExpenseEdit(account);
        });
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

    var accountId;

    if (this.state.accountCurrent) {
      accountId = this.state.accountCurrent._id;
    }

    switch(this.state.page) {
      case 'home':
        router.setRoute('/' + dialogRoute);
        break;

      case 'addExpense':
        router.setRoute('/add' + dialogRoute);
        break;

      case 'accountDetail':
        router.setRoute('/account/' + accountId + dialogRoute);
        break;

      case 'editExpense':
        router.setRoute('/account/' + accountId + '/edit' + dialogRoute);
        break;

      case 'addExpenseForAccount':
        router.setRoute('/account/' + accountId + '/add' + dialogRoute);
        break;
    }

    switch(this.state.page) {
      case 'home':
        layout = <AccountList accounts={this.state.accounts} />;
        break;

      case 'addExpense':
      case 'addExpenseForAccount':
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
