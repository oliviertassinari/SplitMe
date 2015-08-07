'use strict';

var React = require('react');
var Immutable = require('immutable');
var AppCanvas = require('material-ui/lib/app-canvas');
var AppBar = require('material-ui/lib/app-bar');
var Tabs = require('material-ui/lib/tabs/tabs');
var Tab = require('material-ui/lib/tabs/tab');
var IconButton = require('material-ui/lib/icon-button');
var IconClose = require('material-ui/lib/svg-icons/navigation/close');
var IconSettings = require('material-ui/lib/svg-icons/action/settings');
var EventListener = require('react-event-listener');

var polyglot = require('polyglot');
var utils = require('utils');
var ExpenseList = require('Main/Expense/List');
var MainActionButton = require('Main/MainActionButton');
var Balance = require('Main/Account/Balance');
var Debts = require('Main/Account/Debts');
var action = require('Main/Account/action');

var styles = {
  appBar: {
    flexWrap: 'wrap',
  },
  tabs: {
    width: '100%',
  },
  content: {
    paddingTop: 104,
    paddingBottom: 60,
  },
};

var AccountDetail = React.createClass({
  propTypes: {
    page: React.PropTypes.string.isRequired,
    account: React.PropTypes.instanceOf(Immutable.Map).isRequired,
  },
  mixins: [
    EventListener,
    React.addons.PureRenderMixin,
  ],
  listeners: {
    document: {
      backbutton: 'onBackButton',
    },
  },
  onBackButton: function() {
    action.navigateHome();
  },
  onTouchTapAddExpense: function(event) {
    event.preventDefault();
    action.tapAddExpenseForAccount(this.props.account);
  },
  onTouchTapSettings: function (event) {
    event.preventDefault();
    action.tapSettings();
  },
  onTouchTapClose: function(event) {
    event.preventDefault();
    action.navigateHome();
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
        layout = <ExpenseList account={account} />;
        break;
      case 'accountDetailBalance':
        layout = <Balance members={account.get('members')} />;
        break;
      case 'accountDetailDebts':
        layout = <Debts members={account.get('members')} />;
        break;
    }

    var appBarLeft = <IconButton onTouchTap={this.onTouchTapClose}>
        <IconClose />
      </IconButton>;

    var appBarRight = <IconButton onTouchTap={this.onTouchTapSettings} className="testAccountEdit">
        <IconSettings />
      </IconButton>;

    return <AppCanvas>
        <AppBar title={utils.getNameAccount(account)}
          iconElementLeft={appBarLeft}
          iconElementRight={appBarRight} style={styles.appBar}
          className="testAppBar">
          <Tabs onChange={this.onChangeTabs} style={styles.tabs}>
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
