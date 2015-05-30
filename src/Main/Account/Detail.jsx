'use strict';

var React = require('react');
var AppCanvas = require('material-ui/lib/app-canvas');
var AppBar = require('material-ui/lib/app-bar');
var Tabs = require('material-ui/lib/tabs/tabs');
var Tab = require('material-ui/lib/tabs/tab');

var polyglot = require('polyglot');
var ExpenseList = require('Main/Expense/List');
var MainActionButton = require('Main/MainActionButton');
var Balance = require('./Balance');
var Debts = require('./Debts');
var action = require('./action');

var AccountDetail = React.createClass({
  propTypes: {
    account: React.PropTypes.object.isRequired,
  },
  onTouchTapAddExpense: function(event) {
    event.preventDefault();
    action.tapAddExpenseForAccount(this.props.account);
  },
  onTouchTapClose: function(event) {
    event.preventDefault();
    action.tapClose();
  },
  render: function () {
    var account = this.props.account;

    return <AppCanvas predefinedLayout={1}>
      <AppBar title={this.props.account.name}
        showMenuIconButton={true}
        iconClassNameLeft="md-close"
        onLeftIconButtonTouchTap={this.onTouchTapClose}
        className="testAppBar" />
      <div className="app-content-canvas">
        <Tabs>
          <Tab label={polyglot.t('expenses')}>
            <ExpenseList expenses={account.expenses} />
          </Tab>
          <Tab label={polyglot.t('balance')}>
            <Balance members={account.members} />
          </Tab>
          <Tab label={polyglot.t('debts')}>
            <Debts members={account.members} />
          </Tab>
        </Tabs>
      </div>
      <MainActionButton onTouchTap={this.onTouchTapAddExpense} />
    </AppCanvas>;
  },
});

module.exports = AccountDetail;
