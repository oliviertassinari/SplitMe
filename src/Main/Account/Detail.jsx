'use strict';

const React = require('react');
const PureRenderMixin = require('react-addons-pure-render-mixin');
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
const {pushState} = require('redux-router');
const DocumentTitle = require('react-document-title');

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
const ExpenseListEmpty = require('Main/Expense/ListEmpty');

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

const pages = ['account/:id/expenses', 'account/:id/balance', 'account/:id/debt'];

const AccountDetail = React.createClass({
  propTypes: {
    account: React.PropTypes.instanceOf(Immutable.Map),
    dispatch: React.PropTypes.func.isRequired,
    route: React.PropTypes.object.isRequired,
    routeParams: React.PropTypes.object.isRequired,
  },
  mixins: [
    EventListener,
    PureRenderMixin,
  ],
  componentDidMount() {
    setTimeout(() => {
      this.props.dispatch(accountActions.showDetail());
    }, 0);
  },
  listeners: {
    document: {
      backbutton: 'onBackButton',
    },
  },
  onBackButton() {
    this.props.dispatch(screenActions.navigateBack(pushState(null, '/')));
  },
  onTouchTapAddExpense(event) {
    event.preventDefault();
    const props = this.props;

    setTimeout(() => {
      props.dispatch(pushState(null, '/account/' + this.props.routeParams.id + '/expense/add'));
    }, 0);
  },
  onTouchTapSettings(event) {
    event.preventDefault();

    setTimeout(() => {
      this.props.dispatch(pushState(null, '/account/' + this.props.routeParams.id + '/edit'));
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
    this.props.dispatch(accountActions.tapDelete());
  },
  onTouchTapClose(event) {
    event.preventDefault();

    setTimeout(() => {
      this.props.dispatch(pushState(null, '/'));
    }, 0);
  },
  onChangeTabs(value) {
    this.props.dispatch(pushState(null, '/' + value.replace(':id', this.props.routeParams.id)));
  },
  onChangeIndex(index) {
    this.props.dispatch(pushState(null, '/' + pages[index].replace(':id', this.props.routeParams.id)));
  },
  render() {
    const {
      account,
      route,
    } = this.props;

    const index = pages.indexOf(route.path);

    const appBarLeft = (
      <IconButton onTouchTap={this.onTouchTapClose}>
        <IconClose />
      </IconButton>
    );

    const appBarRight = (
      <IconMenu iconButtonElement={<IconButton><IconMoreVert /></IconButton>}
        className="testAccountDetailMore">
        <MenuItem primaryText={polyglot.t('settings')} onTouchTap={this.onTouchTapSettings}
          data-test="AccountDetailSettings" />
        <MenuItem primaryText={polyglot.t('delete')} onTouchTap={this.onTouchTapDelete}
          data-test="AccountDetailDelete" />
      </IconMenu>
    );

    const title = account && accountUtils.getNameAccount(account);

    return (
      <div>
        {PLATFORM === 'browser' && <DocumentTitle title={title} />}
        <CanvasHead>
          <AppBar title={title}
            iconElementLeft={appBarLeft}
            iconElementRight={appBarRight} style={styles.appBar}
            data-test="AppBar">
            <Tabs onChange={this.onChangeTabs} style={styles.tabs} value={route.path}>
              <Tab label={polyglot.t('expenses')} value="account/:id/expenses" />
              <Tab label={polyglot.t('balance')} value="account/:id/balance" />
              <Tab label={polyglot.t('debts')} value="account/:id/debt" />
            </Tabs>
          </AppBar>
        </CanvasHead>
          {account &&
            <SwipeableViews style={styles.swipeable} index={index} onChangeIndex={this.onChangeIndex}>
              <CanvasBody style={styles.content}>
                <ExpenseList account={account} />
                {account.get('expenses').size === 0 && <ExpenseListEmpty />}
              </CanvasBody>
              <CanvasBody style={styles.content}>
                <AccountBalance members={account.get('members')} />
              </CanvasBody>
              <CanvasBody style={styles.content}>
                <AccountDebts members={account.get('members')} />
              </CanvasBody>
            </SwipeableViews>
          }
        <MainActionButton onTouchTap={this.onTouchTapAddExpense} />
      </div>
    );
  },
});

function mapStateToProps(state) {
  return {
    account: state.get('accountCurrent'),
  };
}

module.exports = connect(mapStateToProps)(AccountDetail);
