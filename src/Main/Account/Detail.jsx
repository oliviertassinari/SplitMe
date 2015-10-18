'use strict';

const React = require('react');
const PureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');
const Immutable = require('immutable');
const AppBar = require('material-ui/src/app-bar');
const Tabs = require('material-ui/src/tabs/tabs');
const Tab = require('material-ui/src/tabs/tab');
const IconButton = require('material-ui/src/icon-button');
const IconClose = require('material-ui/src/svg-icons/navigation/close');
const IconMoreVert = require('material-ui/src/svg-icons/navigation/more-vert');
const IconMenu = require('material-ui/src/menus/icon-menu');
const MenuItem = require('material-ui/src/menus/menu-item');
const EventListener = require('react-event-listener');
const {connect} = require('react-redux');

const polyglot = require('polyglot');
const accountUtils = require('Main/Account/utils');
const CanvasHead = require('Main/Canvas/Head');
const CanvasBody = require('Main/Canvas/Body');
const ExpenseList = require('Main/Expense/List');
const MainActionButton = require('Main/MainActionButton');
const AccountBalance = require('Main/Account/Balance');
const AccountDebts = require('Main/Account/Debts');
const accountActions = require('Main/Account/actions');
const screenActions = require('Main/Screen/actions');
const modalActions = require('Main/Modal/actions');
const SwipeableViews = require('react-swipeable-views');

const styles = {
  appBar: {
    flexWrap: 'wrap',
  },
  tabs: {
    width: '100%',
  },
  swipeable: {
    height: '100vh',
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
    snackbarShow: React.PropTypes.bool.isRequired,
  },
  mixins: [
    EventListener,
    PureRenderMixin,
  ],
  listeners: {
    document: {
      backbutton: 'onBackButton',
    },
  },
  onBackButton() {
    this.props.dispatch(screenActions.navigateBack(accountActions.navigateHome()));
  },
  onTouchTapAddExpense(event) {
    event.preventDefault();
    const props = this.props;

    setTimeout(function() {
      props.dispatch(accountActions.tapAddExpenseForAccount(props.account));
    }, 0);
  },
  onTouchTapSettings(event) {
    event.preventDefault();

    setTimeout(() => {
      this.props.dispatch(accountActions.tapSettings());
    }, 0);
  },
  onTouchTapDelete(event) {
    event.preventDefault();

    setTimeout(() => {
      this.props.dispatch(modalActions.show(
        [
          {textKey: 'cancel'},
          {textKey: 'delete', onTouchTap: this.onTouchTapDeleteConfirm},
        ],
        'account_delete_description',
        'account_delete_title'
      ));
    }, 0);
  },
  onTouchTapDeleteConfirm() {
    this.props.dispatch(accountActions.deleteCurrent());
  },
  onTouchTapClose(event) {
    event.preventDefault();

    setTimeout(() => {
      this.props.dispatch(accountActions.navigateHome());
    }, 0);
  },
  onChangeTabs(value) {
    this.props.dispatch(screenActions.navigateTo(value));
  },
  onChangeIndex(index) {
    const pages = ['accountDetail', 'accountDetailBalance', 'accountDetailDebts'];

    this.props.dispatch(screenActions.navigateTo(pages[index]));
  },
  render() {
    const {
      account,
      snackbarShow,
    } = this.props;

    const pages = ['accountDetail', 'accountDetailBalance', 'accountDetailDebts'];
    const index = pages.indexOf(this.props.page);

    const appBarLeft = (
      <IconButton onTouchTap={this.onTouchTapClose}>
        <IconClose />
      </IconButton>
    );

    const appBarRight = (
      <IconMenu iconButtonElement={<IconButton><IconMoreVert /></IconButton>}
        className="testAccountMore">
        <MenuItem primaryText="Settings" onTouchTap={this.onTouchTapSettings} data-test="AccountEditSetting" />
        <MenuItem primaryText="Delete" onTouchTap={this.onTouchTapDelete} data-test="AccountEditDelete" />
      </IconMenu>
    );

    return (
      <div>
        <CanvasHead>
          <AppBar title={accountUtils.getNameAccount(account)}
            iconElementLeft={appBarLeft}
            iconElementRight={appBarRight} style={styles.appBar}
            data-test="AppBar">
            <Tabs onChange={this.onChangeTabs} style={styles.tabs} value={this.props.page}>
              <Tab label={polyglot.t('expenses')} value="accountDetail" />
              <Tab label={polyglot.t('balance')} value="accountDetailBalance" />
              <Tab label={polyglot.t('debts')} value="accountDetailDebts" />
            </Tabs>
          </AppBar>
        </CanvasHead>
          <SwipeableViews style={styles.swipeable} index={index} onChangeIndex={this.onChangeIndex}>
            <CanvasBody style={styles.content}>
              <ExpenseList account={account} />
            </CanvasBody>
            <CanvasBody style={styles.content}>
              <AccountBalance members={account.get('members')} />
            </CanvasBody>
            <CanvasBody style={styles.content}>
              <AccountDebts members={account.get('members')} />
            </CanvasBody>
          </SwipeableViews>
        <MainActionButton onTouchTap={this.onTouchTapAddExpense} snackbarShow={snackbarShow} />
      </div>
    );
  },
});

module.exports = connect()(AccountDetail);
