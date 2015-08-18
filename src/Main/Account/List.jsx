'use strict';

var React = require('react');
var Immutable = require('immutable');
var AppCanvas = require('material-ui/lib/app-canvas');
var AppBar = require('material-ui/lib/app-bar');
var Paper = require('material-ui/lib/paper');
var IconButton = require('material-ui/lib/icon-button');
var IconSettings = require('material-ui/lib/svg-icons/action/settings');
var EventListener = require('react-event-listener');
var connect = require('react-redux').connect;

var polyglot = require('polyglot');
var utils = require('utils');
var List = require('Main/List');
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
    this.props.dispatch(screenActions.exitApp());
  },
  onTouchTapList: function(account) {
    accountActions.tapList(account);
  },
  onTouchTapAddExpense: function() {
    var dispatch = this.props.dispatch;

    setTimeout(function() {
      dispatch(accountActions.tapAddExpense());
    });
  },
  onTouchTapSettings: function() {
    var dispatch = this.props.dispatch;

    setTimeout(function() {
      dispatch(screenActions.navigateSettings());
    });
  },
  render: function() {
    var self = this;

    var appBarRight = <IconButton onTouchTap={this.onTouchTapSettings}>
        <IconSettings />
      </IconButton>;

    return <AppCanvas>
      <AppBar title={polyglot.t('my_accounts')}
        iconElementLeft={<div />}
        iconElementRight={appBarRight} />
      <div className="app-content-canvas" style={styles.content}>
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
      </div>
      <MainActionButton onTouchTap={this.onTouchTapAddExpense} />
    </AppCanvas>;
  },
});

module.exports = connect()(AccountList);
