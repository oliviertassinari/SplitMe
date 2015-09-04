'use strict';

var React = require('react');
var Immutable = require('immutable');
var AppBar = require('material-ui/lib/app-bar');
var Tabs = require('material-ui/lib/tabs/tabs');
var Tab = require('material-ui/lib/tabs/tab');
var IconButton = require('material-ui/lib/icon-button');
var IconClose = require('material-ui/lib/svg-icons/navigation/close');
var IconMoreVert = require('material-ui/lib/svg-icons/navigation/more-vert');
var IconMenu = require('material-ui/lib/menus/icon-menu');
var MenuItem = require('material-ui/lib/menus/menu-item');
var EventListener = require('react-event-listener');
var connect = require('react-redux').connect;

var polyglot = require('polyglot');
var utils = require('utils');
var CanvasHead = require('Main/Canvas/Head');
var CanvasBody = require('Main/Canvas/Body');
var ExpenseList = require('Main/Expense/List');
var MainActionButton = require('Main/MainActionButton');
var Balance = require('Main/Account/Balance');
var Debts = require('Main/Account/Debts');
var accountActions = require('Main/Account/actions');
var screenActions = require('Main/Screen/actions');
var modalActions = require('Main/Modal/actions');

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
    account: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    dispatch: React.PropTypes.func.isRequired,
    page: React.PropTypes.string.isRequired,
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
    this.props.dispatch(accountActions.navigateHome());
  },
  onTouchTapAddExpense: function(event) {
    event.preventDefault();
    var props = this.props;

    setTimeout(function() {
      props.dispatch(accountActions.tapAddExpenseForAccount(props.account));
    }, 0);
  },
  onTouchTapSettings: function(event) {
    event.preventDefault();
    var dispatch = this.props.dispatch;

    setTimeout(function() {
      dispatch(accountActions.tapSettings());
    }, 0);
  },
  onTouchTapDelete: function(event) {
    event.preventDefault();
    var dispatch = this.props.dispatch;
    var self = this;

    setTimeout(function() {
      dispatch(modalActions.show(
        [
          { textKey: 'cancel' },
          { textKey: 'delete', onTouchTap: self.onTouchTapDeleteConfirm },
        ],
        'account_delete_description',
        'account_delete_title'
      ));
    }, 0);
  },
  onTouchTapDeleteConfirm: function() {
    this.props.dispatch(accountActions.deleteCurrent());
  },
  onTouchTapClose: function(event) {
    event.preventDefault();
    var dispatch = this.props.dispatch;

    setTimeout(function() {
      dispatch(accountActions.navigateHome());
    }, 0);
  },
  onChangeTabs: function(value) {
    this.props.dispatch(screenActions.navigateTo(value));
  },
  render: function() {
    var account = this.props.account;
    var layout;

    switch (this.props.page) {
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

    var appBarRight = <IconMenu iconButtonElement={<IconButton><IconMoreVert /></IconButton>}
      className="testAccountMore">
        <MenuItem primaryText="Settings" onTouchTap={this.onTouchTapSettings} className="testAccountEditButton" />
        <MenuItem primaryText="Delete" onTouchTap={this.onTouchTapDelete} />
      </IconMenu>;

    return <div>
        <CanvasHead>
          <AppBar title={utils.getNameAccount(account)}
            iconElementLeft={appBarLeft}
            iconElementRight={appBarRight} style={styles.appBar}
            className="testAppBar">
            <Tabs onChange={this.onChangeTabs} style={styles.tabs}>
              <Tab label={polyglot.t('expenses')} value="accountDetail" />
              <Tab label={polyglot.t('balance')} value="accountDetailBalance" />
              <Tab label={polyglot.t('debts')} value="accountDetailDebts" />
            </Tabs>
          </AppBar>
        </CanvasHead>
        <CanvasBody style={styles.content}>
          {layout}
        </CanvasBody>
        <MainActionButton onTouchTap={this.onTouchTapAddExpense} />
      </div>;
  },
});

module.exports = connect()(AccountDetail);
