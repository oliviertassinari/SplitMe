'use strict';

var React = require('react');
var _ = require('underscore');

var pageStore = require('./pageStore');
var router = require('./router');

var action = require('./action');
var accountStore = require('./Account/store');
var AccountListView = require('./Account/ListView');

var expenseStore = require('./Expense/store');
var ExpenseAddView = require('./Expense/AddView');

function getState() {
  return {
    accountAll: accountStore.getAll(),
    accountCurrent: accountStore.getCurrent(),
    expenseCurrent: expenseStore.getCurrent(),
    page: pageStore.get(),
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

    if(this.state.page === 'home') {
      layout = <AccountListView accounts={this.state.accountAll} />;
    } else {
      layout = <ExpenseAddView expenseCurrent={this.state.expenseCurrent}/>;
    }

    return layout;
  },
});

module.exports = MainView;
