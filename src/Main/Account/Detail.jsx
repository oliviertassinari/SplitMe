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

var styles = {
  content: {
    paddingTop: 104,
  },
};

var AccountDetail = React.createClass({
  propTypes: {
    page: React.PropTypes.string.isRequired,
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
  onChangeTabs: function (index) {
    switch (index) {
      case 0:
        action.tapExpenses();
        break;

      case 1:
        action.tapBalance();
        break;

      case 2:
        action.tapDebts();
        break;
    }
  },
  render: function () {
    var account = this.props.account;
    var layout;

    switch(this.props.page) {
      case 'accountDetail':
        layout = <ExpenseList expenses={account.expenses} />;
        break;
      case 'accountDetailBalance':
        layout = <Balance members={account.members} />;
        break;
      case 'accountDetailDebts':
        layout = <Debts members={account.members} />;
        break;
    }

    return <AppCanvas predefinedLayout={1}>
      <AppBar title={this.props.account.name}
        showMenuIconButton={true}
        iconClassNameLeft="md-close"
        onLeftIconButtonTouchTap={this.onTouchTapClose}
        className="testAppBar">
        <Tabs onChange={this.onChangeTabs}>
          <Tab label={polyglot.t('expenses')} />
          <Tab label={polyglot.t('balance')} />
          <Tab label={polyglot.t('debts')} />
        </Tabs>
      </AppBar>
      <div className="app-content-canvas" style={styles.content}>
        {layout}
      </div>
      <MainActionButton onTouchTap={this.onTouchTapAddExpense} />
    </AppCanvas>;
  },
});

module.exports = AccountDetail;
