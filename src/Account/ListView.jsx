'use strict';

var React = require('react');
var _ = require('underscore');
var mui = require('material-ui');
var AppCanvas = mui.AppCanvas;
var AppBar = mui.AppBar;
var FloatingActionButton = mui.FloatingActionButton;
var Paper = mui.Paper;

var List = require('../List/View');
var action = require('./action');
var Avatar = require('../Avatar/View');
var utils = require('../utils');

var ListView = React.createClass({
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

  render: function () {
    var self = this;

    return <AppCanvas predefinedLayout={1}>
      <AppBar title="My accounts" showMenuIconButton={false}>
      </AppBar>
      <div className="mui-app-content-canvas">
        {_.map(this.props.accounts, function (account) {
          var left = <Avatar contacts={[{displayName:'tt'}]} />;
          var right = _.map(account.balances, function(balance) {
            var text;
            var className;

            if(balance.value < 0) {
              text = 'you owe';
              className = 'account-balance-you-owe';
            } else if(balance.value > 0) {
              text = 'owes you';
              className = 'account-balance-owes-you';
            } else {
              return null;
            }

            return <span key={account._id}>
              {text}<br />
              <span className={'mui-font-style-title ' + className}>
                {Math.abs(utils.roundAmount(balance.value)) + ' ' + utils.currencyMap[balance.currency]}
              </span>
            </span>;
          });

          if(right[0] === null) {
            right = <span className="account-balance-settled-up">settled up</span>;
          }

          return <Paper key={account._id} zDepth={1} rounded={false}
                   onTouchTap={self.onTouchTapList.bind(self, account)}>
              <List left={left} right={right} className="mui-menu-item">
                {account.name}
              </List>
            </Paper>;
        })}
        <div id="main-button">
          <FloatingActionButton
            iconClassName="md-add"
            secondary={true}
            onTouchTap={this.onTouchTapAddExpense} />
        </div>
      </div>
    </AppCanvas>;
  }
});

module.exports = ListView;
