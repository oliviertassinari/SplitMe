'use strict';

const React = require('react');
const PureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');
const Immutable = require('immutable');
const reselect = require('reselect');
const AppBar = require('material-ui/lib/app-bar');
const Paper = require('material-ui/lib/paper');
const IconButton = require('material-ui/lib/icon-button');
const IconSettings = require('material-ui/lib/svg-icons/action/settings');
const ListItem = require('material-ui/lib/lists/list-item');
const EventListener = require('react-event-listener');
const {connect} = require('react-redux');
const moment = require('moment');

const config = require('config');
const locale = require('locale');
const polyglot = require('polyglot');
const accountUtils = require('Main/Account/utils');
const CanvasHead = require('Main/Canvas/Head');
const CanvasBody = require('Main/Canvas/Body');
const MembersAvatar = require('Main/MembersAvatar');
const screenActions = require('Main/Screen/actions');
const MainActionButton = require('Main/MainActionButton');
const AccountListItemBalance = require('Main/Account/ListItemBalance');
const accountActions = require('Main/Account/actions');
const ListItemBody = require('Main/ListItemBody');

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
    accounts: React.PropTypes.instanceOf(Immutable.List).isRequired,
    accountsSorted: React.PropTypes.instanceOf(Immutable.List).isRequired,
    dispatch: React.PropTypes.func.isRequired,
  },
  mixins: [
    EventListener,
    PureRenderMixin,
  ],
  statics: {
    getAccountsSorted: function(accounts) {
      // DESC date order
      return accounts.sort(function(accountA, accountB) {
        if (accountA.get('dateLatestExpense') < accountB.get('dateLatestExpense')) {
          return 1;
        } else if (accountA.get('dateLatestExpense') === accountB.get('dateLatestExpense')) {
          return accountA.get('dateUpdated') < accountB.get('dateUpdated') ? 1 : -1;
        } else {
          return -1;
        }
      });
    },
  },
  listeners: {
    document: {
      backbutton: 'onBackButton',
    },
  },
  onBackButton: function() {
    if (config.platform === 'android') {
      window.navigator.app.exitApp();
    } else {
      console.info('Trigger exit the app');
    }
  },
  onTouchTapList: function(account, event) {
    event.preventDefault();

    setTimeout(() => {
      this.props.dispatch(accountActions.tapList(account));
    }, 0);
  },
  onTouchTapAddExpense: function(event) {
    event.preventDefault();

    setTimeout(() => {
      this.props.dispatch(accountActions.tapAddExpense());
    }, 0);
  },
  onTouchTapSettings: function(event) {
    event.preventDefault();

    setTimeout(() => {
      this.props.dispatch(screenActions.navigateTo('settings'));
    }, 0);
  },
  render: function() {
    const self = this;

    const appBarRight = <IconButton onTouchTap={this.onTouchTapSettings} className="testSettings">
        <IconSettings />
      </IconButton>;

    return <div>
      <CanvasHead>
        <AppBar title={polyglot.t('my_accounts')}
          iconElementLeft={<div />} className="testAppBar"
          iconElementRight={appBarRight} />
      </CanvasHead>
      <CanvasBody style={styles.content}>
        <Paper rounded={false}>
          {this.props.accountsSorted.map(function(account) {
            const avatar = <MembersAvatar members={account.get('members')} style={styles.avatar} />;
            const accountListItemBalance = <AccountListItemBalance account={account} />;
            const date = locale.dateTimeFormat(locale.current, {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            }).format(moment(account.get('dateLatestExpense'), 'YYYY-MM-DD')); // Sep 13, 2015

            return <ListItem leftAvatar={avatar} className="testListItem"
              onTouchTap={self.onTouchTapList.bind(self, account)} key={account.get('_id')}>
                <ListItemBody title={accountUtils.getNameAccount(account)} right={accountListItemBalance}
                  description={polyglot.t('latest_expense', {date: date})} />
              </ListItem>;
          })}
        </Paper>
      </CanvasBody>
      <MainActionButton onTouchTap={this.onTouchTapAddExpense} />
    </div>;
  },
});

const select = reselect.createSelector(
  (state, props) => props.accounts,
  (accounts) => {
    return {
      accountsSorted: AccountList.getAccountsSorted(accounts),
    };
  }
);

module.exports = connect(select)(AccountList);
