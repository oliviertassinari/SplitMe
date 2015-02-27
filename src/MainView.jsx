'use strict';

var React = require('react');
var _ = require('underscore');

var pageStore = require('./pageStore');
var router = require('./router');

var action = require('./action');
var accountStore = require('./Account/store');
var AccountListView = require('./Account/ListView');

var ExpenseAddView = require('./Expense/AddView');

function getState() {
  return {
    accountAll: accountStore.getAll(),
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

    _.each([accountStore, pageStore], function(store) {
      store.addChangeListener(self._onChange);
    });
  },
  componentWillUnmount: function() {
    var self = this;

    _.each([accountStore, pageStore], function(store) {
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
      layout = <ExpenseAddView />;
    }

    return layout;
  },
});

module.exports = MainView;
