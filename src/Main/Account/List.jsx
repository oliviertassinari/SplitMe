'use strict';

var React = require('react');
var _ = require('underscore');
var AppCanvas = require('material-ui/lib/app-canvas');
var AppBar = require('material-ui/lib/app-bar');
var Paper = require('material-ui/lib/paper');
var DropDownIcon = require('material-ui/lib/drop-down-icon');

var polyglot = require('polyglot');
var List = require('Main/List');
var Avatar = require('Main/Avatar');
var pageAction = require('Main/pageAction');
var MainActionButton = require('Main/MainActionButton');
var ListBalance = require('./ListBalance');
var action = require('./action');

var AccountList = React.createClass({
  propTypes: {
    accounts: React.PropTypes.array.isRequired,
  },
  onTouchTapList: function(account, event) {
    event.preventDefault();
    action.tapList(account);
  },
  onTouchTapAddExpense: function(event) {
    event.preventDefault();
    action.tapAddExpense();
  },
  onChangeDropDownIcon: function(event, key, payload) {
    if (payload.payload === 'settings') {
      pageAction.navigateSettings();
    }
  },
  render: function () {
    var self = this;

    var appBarMenuItems = [
      {
        payload: 'settings',
        text: polyglot.t('settings')
      },
    ];

    var iconElementRight = <DropDownIcon className="app-bar-drop-down-icon"
      iconClassName="md-more-vert" menuItems={appBarMenuItems}
      onChange={self.onChangeDropDownIcon} />;

    return <AppCanvas>
      <AppBar title={polyglot.t('my_accounts')} showMenuIconButton={false} iconElementRight={iconElementRight} />
      <div className="app-content-canvas">
        <Paper rounded={false}>
          {_.map(this.props.accounts, function (account) {
            var avatar = <Avatar contacts={account.members} />;
            var listBalance = <ListBalance account={account} />;

            return <List left={avatar} right={listBalance}
                    onTouchTap={self.onTouchTapList.bind(self, account)} key={account._id}>
                  {account.name}
                </List>;
          })}
        </Paper>
      </div>
      <MainActionButton onTouchTap={this.onTouchTapAddExpense} />
    </AppCanvas>;
  },
});

module.exports = AccountList;
