'use strict';

const React = require('react');
const PureRenderMixin = require('react-addons-pure-render-mixin');
const Immutable = require('immutable');
const reselect = require('reselect');
const AppBar = require('material-ui/lib/app-bar');
const Paper = require('material-ui/lib/paper');
const IconButton = require('material-ui/lib/icon-button');
const IconMoreVert = require('material-ui/lib/svg-icons/navigation/more-vert');
const IconMenu = require('material-ui/lib/menus/icon-menu');
const MenuItem = require('material-ui/lib/menus/menu-item');
const ListItem = require('material-ui/lib/lists/list-item');
const EventListener = require('react-event-listener');
const {connect} = require('react-redux');
const {pushState} = require('redux-router');
const moment = require('moment');
const DocumentTitle = require('react-document-title');

const API = require('API');
const locale = require('locale');
const polyglot = require('polyglot');
const accountUtils = require('Main/Account/utils');
const CanvasHead = require('Main/Canvas/Head');
const CanvasBody = require('Main/Canvas/Body');
const MembersAvatar = require('Main/MembersAvatar');
const MainActionButton = require('Main/MainActionButton');
const AccountListItemBalance = require('Main/Account/ListItemBalance');
const ListItemBody = require('Main/ListItemBody');
const AccountListEmpty = require('Main/Account/ListEmpty');

const styles = {
  content: {
    paddingBottom: 60,
  },
  // Fix for displaying element at the right of the ListItem
  avatar: {
    top: 16,
  },
  // End of fix
};

const AccountList = React.createClass({
  propTypes: {
    accountsSorted: React.PropTypes.instanceOf(Immutable.List).isRequired,
    dispatch: React.PropTypes.func.isRequired,
    isAccountsFetched: React.PropTypes.bool.isRequired,
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
    if (PLATFORM === 'android') {
      window.navigator.app.exitApp();
    } else {
      console.info('Trigger exit the app');
    }
  },
  onTouchTapList(account, event) {
    event.preventDefault();

    setTimeout(() => {
      this.props.dispatch(pushState(null, '/account/' +
        API.accountRemovePrefixId(account.get('_id')) +
        '/expenses'));
    }, 0);
  },
  onTouchTapAddExpense(event) {
    event.preventDefault();

    setTimeout(() => {
      this.props.dispatch(pushState(null, '/expense/add'));
    }, 0);
  },
  onTouchTapSettings(event) {
    event.preventDefault();

    setTimeout(() => {
      this.props.dispatch(pushState(null, '/settings'));
    }, 0);
  },
  onTouchTapAddAccount() {
    event.preventDefault();

    setTimeout(() => {
      this.props.dispatch(pushState(null, '/account/add'));
    }, 0);
  },
  render() {
    const {
      accountsSorted,
      isAccountsFetched,
    } = this.props;

    const appBarRight = (
      <IconMenu iconButtonElement={<IconButton><IconMoreVert /></IconButton>}
        className="testAccountListMore">
        <MenuItem primaryText={polyglot.t('settings')} onTouchTap={this.onTouchTapSettings}
          data-test="Settings" />
        <MenuItem primaryText={polyglot.t('account_add_new')} onTouchTap={this.onTouchTapAddAccount}
          data-test="AccountAddNew" />
      </IconMenu>
    );

    return (
      <div>
        {PLATFORM === 'browser' && <DocumentTitle title={polyglot.t('my_accounts')} />}
        <CanvasHead>
          <AppBar title={polyglot.t('my_accounts')}
            iconElementLeft={<div />} data-test="AppBar"
            iconElementRight={appBarRight} />
        </CanvasHead>
        <CanvasBody style={styles.content}>
          <Paper rounded={false}>
            {accountsSorted.map((account) => {
              const avatar = <MembersAvatar members={account.get('members')} style={styles.avatar} />;
              const accountListItemBalance = <AccountListItemBalance account={account} />;

              let description;

              if (account.get('expenses').size > 0) {
                const date = locale.dateTimeFormat(locale.current, {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                }).format(moment(account.get('dateLatestExpense'), 'YYYY-MM-DD')); // Sep 13, 2015
                description = polyglot.t('expense_latest', {date: date});
              } else {
                description = polyglot.t('expense_no');
              }

              return (
                <ListItem leftAvatar={avatar} data-test="ListItem"
                  onTouchTap={this.onTouchTapList.bind(this, account)} key={account.get('_id')}>
                  <ListItemBody title={accountUtils.getNameAccount(account)} right={accountListItemBalance}
                    description={description} />
                </ListItem>
              );
            })}
          </Paper>
          {isAccountsFetched && accountsSorted.size === 0 && <AccountListEmpty />}
        </CanvasBody>
        <MainActionButton onTouchTap={this.onTouchTapAddExpense} />
      </div>
    );
  },
});

function getAccountsSorted(accounts) {
  // DESC date order
  return accounts.sort((accountA, accountB) => {
    if (accountA.get('dateLatestExpense') < accountB.get('dateLatestExpense')) {
      return 1;
    } else if (accountA.get('dateLatestExpense') === accountB.get('dateLatestExpense')) {
      return accountA.get('dateUpdated') < accountB.get('dateUpdated') ? 1 : -1;
    } else {
      return -1;
    }
  });
}

const selectAccountSorted = reselect.createSelector(
  (state) => state.get('accounts'),
  (accounts) => {
    return getAccountsSorted(accounts);
  }
);

function mapStateToProps(state) {
  return {
    accountsSorted: selectAccountSorted(state),
    isAccountsFetched: state.get('isAccountsFetched'),
  };
}

module.exports = connect(mapStateToProps)(AccountList);
