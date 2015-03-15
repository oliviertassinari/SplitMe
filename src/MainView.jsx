'use strict';

var React = require('react');
var _ = require('underscore');

var pageStore = require('./pageStore');
var router = require('./router');

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

    switch(this.state.page) {
      case 'home':
        layout = <AccountList accounts={this.state.accounts} />;
        break;

      case 'addExpense':
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
