'use strict';

const React = require('react');
const Immutable = require('immutable');
const AppBar = require('material-ui/lib/app-bar');
const Tabs = require('material-ui/lib/tabs/tabs');
const Tab = require('material-ui/lib/tabs/tab');
const IconButton = require('material-ui/lib/icon-button');
const IconClose = require('material-ui/lib/svg-icons/navigation/close');
const IconMoreVert = require('material-ui/lib/svg-icons/navigation/more-vert');
const IconMenu = require('material-ui/lib/menus/icon-menu');
const MenuItem = require('material-ui/lib/menus/menu-item');
const EventListener = require('react-event-listener');
const {connect} = require('react-redux');

const polyglot = require('polyglot');
const accountUtils = require('Main/Account/utils');
const CanvasHead = require('Main/Canvas/Head');
const CanvasBody = require('Main/Canvas/Body');
const ExpenseList = require('Main/Expense/List');
const MainActionButton = require('Main/MainActionButton');
const Balance = require('Main/Account/Balance');
const Debts = require('Main/Account/Debts');
const accountActions = require('Main/Account/actions');
const screenActions = require('Main/Screen/actions');
const modalActions = require('Main/Modal/actions');

const styles = {
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

const AccountDetail = React.createClass({
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
    this.props.dispatch(screenActions.navigateBack(accountActions.navigateHome()));
  },
  onTouchTapAddExpense: function(event) {
    event.preventDefault();
    const props = this.props;

    setTimeout(function() {
      props.dispatch(accountActions.tapAddExpenseForAccount(props.account));
    }, 0);
  },
  onTouchTapSettings: function(event) {
    event.preventDefault();
    const dispatch = this.props.dispatch;

    setTimeout(function() {
      dispatch(accountActions.tapSettings());
    }, 0);
  },
  onTouchTapDelete: function(event) {
    event.preventDefault();
    const dispatch = this.props.dispatch;
    const self = this;

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
    const dispatch = this.props.dispatch;

    setTimeout(function() {
      dispatch(accountActions.navigateHome());
    }, 0);
  },
  onChangeTabs: function(value) {
    this.props.dispatch(screenActions.navigateTo(value));
  },
  render: function() {
    const account = this.props.account;
    let layout;

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

    const appBarLeft = <IconButton onTouchTap={this.onTouchTapClose}>
        <IconClose />
      </IconButton>;

    const appBarRight = <IconMenu iconButtonElement={<IconButton><IconMoreVert /></IconButton>}
      className="testAccountMore">
        <MenuItem primaryText="Settings" onTouchTap={this.onTouchTapSettings} className="testAccountEditSetting" />
        <MenuItem primaryText="Delete" onTouchTap={this.onTouchTapDelete} className="testAccountEditDelete" />
      </IconMenu>;

    return <div>
        <CanvasHead>
          <AppBar title={accountUtils.getNameAccount(account)}
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
