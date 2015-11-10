import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Immutable from 'immutable';
import AppBar from 'material-ui/lib/app-bar';
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';
import IconButton from 'material-ui/lib/icon-button';
import IconClose from 'material-ui/lib/svg-icons/navigation/close';
import IconMoreVert from 'material-ui/lib/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import EventListener from 'react-event-listener';
import {connect} from 'react-redux';
import {pushState} from 'redux-router';
import DocumentTitle from 'react-document-title';

import polyglot from 'polyglot';
import accountUtils from 'Main/Account/utils';
import CanvasHead from 'Main/Canvas/Head';
import CanvasBody from 'Main/Canvas/Body';
import ExpenseList from 'Main/Expense/List';
import MainActionButton from 'Main/MainActionButton';
import AccountBalance from 'Main/Account/Balance';
import AccountDebts from 'Main/Account/Debts';
import accountActions from 'Main/Account/actions';
import screenActions from 'Main/Screen/actions';
import modalActions from 'Main/Modal/actions';
import SwipeableViews from 'react-swipeable-views';
import ExpenseListEmpty from 'Main/Expense/ListEmpty';

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

export default connect(mapStateToProps)(AccountDetail);
