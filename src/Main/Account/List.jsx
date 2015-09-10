'use strict';

const React = require('react');
const Immutable = require('immutable');
const AppBar = require('material-ui/lib/app-bar');
const Paper = require('material-ui/lib/paper');
const IconButton = require('material-ui/lib/icon-button');
const IconSettings = require('material-ui/lib/svg-icons/action/settings');
const ListItem = require('material-ui/lib/lists/list-item');
const EventListener = require('react-event-listener');
const {connect} = require('react-redux');

const config = require('config');
const polyglot = require('polyglot');
const accountUtils = require('Main/Account/utils');
const CanvasHead = require('Main/Canvas/Head');
const CanvasBody = require('Main/Canvas/Body');
const MembersAvatar = require('Main/MembersAvatar');
const screenActions = require('Main/Screen/actions');
const MainActionButton = require('Main/MainActionButton');
const ListBalance = require('Main/Account/ListBalance');
const accountActions = require('Main/Account/actions');

const styles = {
  content: {
    paddingBottom: 60,
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
  },
};

const AccountList = React.createClass({
  propTypes: {
    accounts: React.PropTypes.instanceOf(Immutable.List).isRequired,
    dispatch: React.PropTypes.func.isRequired,
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
    if (config.platform === 'android') {
      window.navigator.app.exitApp();
    } else {
      console.info('Trigger exit the app');
    }
  },
  onTouchTapList: function(account, event) {
    event.preventDefault();
    const dispatch = this.props.dispatch;

    setTimeout(function() {
      dispatch(accountActions.tapList(account));
    }, 0);
  },
  onTouchTapAddExpense: function(event) {
    event.preventDefault();
    const dispatch = this.props.dispatch;

    setTimeout(function() {
      dispatch(accountActions.tapAddExpense());
    }, 0);
  },
  onTouchTapSettings: function(event) {
    event.preventDefault();
    const dispatch = this.props.dispatch;

    setTimeout(function() {
      dispatch(screenActions.navigateTo('settings'));
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
          {this.props.accounts.map(function(account) {
            const avatar = <MembersAvatar members={account.get('members')} />;
            const listBalance = <ListBalance account={account} />;

            return <ListItem leftAvatar={avatar} primaryText={accountUtils.getNameAccount(account)}
              onTouchTap={self.onTouchTapList.bind(self, account)} key={account.get('_id')}
              innerDivStyle={styles.listItem} className="testList">
                  {listBalance}
                </ListItem>;
          })}
        </Paper>
      </CanvasBody>
      <MainActionButton onTouchTap={this.onTouchTapAddExpense} />
    </div>;
  },
});

module.exports = connect()(AccountList);
