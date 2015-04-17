'use strict';

var React = require('react');
var _ = require('underscore');

var router = require('../router');
var API = require('../API');
var pageStore = require('./pageStore');

var pageAction = require('./pageAction');
var accountStore = require('./Account/store');
var AccountList = require('./Account/List');
var AccountDetail = require('./Account/Detail');
var accountAction = require('./Account/action');

var Modal = require('./Modal/Modal');
var modalStore = require('./Modal/store');

var expenseStore = require('./Expense/store');
var ExpenseAdd = require('./Expense/Add');


require('./main.less');

function getState() {
  return {
    accounts: accountStore.getAll(),
    accountCurrent: accountStore.getCurrent(),
    expenseCurrent: expenseStore.getCurrent(),
    page: pageStore.get(),
    pageDialog: pageStore.getDialog(),
    modal: modalStore.getModal(),
  };
}

var Main = React.createClass({
  getInitialState: function() {
    return getState();
  },
  componentDidMount: function() {
    var self = this;

    router.on('/', function() {
      pageAction.navigateHome();
    });

    router.on('/add', function() {
      pageAction.navigateExpenseAdd();
    });

    router.path('/account/:accountId', function () {
      this.on('', function (accountId) {
        API.fetchAccount(accountId).then(function(account) {
          pageAction.navigateAccount(account);
        });
      });

      this.on('/edit', function () {
        pageAction.navigateExpenseEdit();
      });

      this.on('/add', function (accountId) {
        API.fetchAccount(accountId).then(function(account) {
          accountAction.tapAddExpenseForAccount(account);
        });
      });
    });

    _.each([accountStore, pageStore, expenseStore, modalStore], function(store) {
      store.addChangeListener(self._onChange);
    });
  },
  componentWillUnmount: function() {
    var self = this;

    _.each([accountStore, pageStore, expenseStore, modalStore], function(store) {
      store.removeChangeListener(self._onChange);
    });
  },
  _onChange: function() {
    this.setState(getState());
  },
  render: function() {
    var layout;
    var dialogRoute = '';
    var state = this.state;

    if (state.pageDialog !== '') {
      dialogRoute = '/' + state.pageDialog;
    }

    var accountId;

    if (state.accountCurrent) {
      accountId = state.accountCurrent._id;
    }

    switch(state.page) {
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

    switch(state.page) {
      case 'home':
        layout = <AccountList accounts={state.accounts} />;
        break;

      case 'addExpense':
      case 'addExpenseForAccount':
      case 'editExpense':
        layout = <ExpenseAdd expense={state.expenseCurrent}
                  pageDialog={state.pageDialog} />;
        break;

      case 'accountDetail':
        layout = <AccountDetail account={state.accountCurrent} />;
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
