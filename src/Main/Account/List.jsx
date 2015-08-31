'use strict';

var React = require('react');
var Immutable = require('immutable');
var AppBar = require('material-ui/lib/app-bar');
var Paper = require('material-ui/lib/paper');
var IconButton = require('material-ui/lib/icon-button');
var IconSettings = require('material-ui/lib/svg-icons/action/settings');
var EventListener = require('react-event-listener');
var connect = require('react-redux').connect;

var polyglot = require('polyglot');
var utils = require('utils');
var List = require('Main/List');
var CanvasHead = require('Main/Canvas/Head');
var CanvasBody = require('Main/Canvas/Body');
var MembersAvatar = require('Main/MembersAvatar');
var screenActions = require('Main/Screen/actions');
var MainActionButton = require('Main/MainActionButton');
var ListBalance = require('Main/Account/ListBalance');
var accountActions = require('Main/Account/actions');

var styles = {
  content: {
    paddingBottom: 60,
  },
};

var AccountList = React.createClass({
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
    if (PLATFORM === 'android') {
      window.navigator.app.exitApp();
    } else {
      console.info('Trigger exit the app');
    }
  },
  onTouchTapList: function(account, event) {
    event.preventDefault();
    var dispatch = this.props.dispatch;

    setTimeout(function() {
      dispatch(accountActions.tapList(account));
    }, 0);
  },
  onTouchTapAddExpense: function(event) {
    event.preventDefault();
    var dispatch = this.props.dispatch;

    setTimeout(function() {
      dispatch(accountActions.tapAddExpense());
    }, 0);
  },
  onTouchTapSettings: function(event) {
    event.preventDefault();
    var dispatch = this.props.dispatch;

    setTimeout(function() {
      dispatch(screenActions.navigateTo('settings'));
    }, 0);
  },
  render: function() {
    var self = this;

    var appBarRight = <IconButton onTouchTap={this.onTouchTapSettings} className="testSettings">
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
            var avatar = <MembersAvatar members={account.get('members')} />;
            var listBalance = <ListBalance account={account} />;

            return <List left={avatar} right={listBalance}
              onTouchTap={self.onTouchTapList.bind(self, account)} key={account.get('_id')}>
                  {utils.getNameAccount(account)}
                </List>;
          })}
        </Paper>
      </CanvasBody>
      <MainActionButton onTouchTap={this.onTouchTapAddExpense} />
    </div>;
  },
});

module.exports = connect()(AccountList);
