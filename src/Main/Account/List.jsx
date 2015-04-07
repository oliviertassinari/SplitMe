'use strict';

var React = require('react');
var _ = require('underscore');
var mui = require('material-ui');
var AppCanvas = mui.AppCanvas;
var AppBar = mui.AppBar;
var FloatingActionButton = mui.FloatingActionButton;
var Paper = mui.Paper;

var polyglot = require('../../polyglot');
var utils = require('../../utils');
var List = require('../List/View');
var Avatar = require('../Avatar/View');
var action = require('./action');

require('./list.less');

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
      <AppBar title={polyglot.t('my_accounts')} showMenuIconButton={false}>
      </AppBar>
      <div className="mui-app-content-canvas account">
        {_.map(this.props.accounts, function (account) {
          var avatarContacts;

          for(var i = 0; i < account.members.length; i++) {
            var member = account.members[i];
            if(member.id !== '0') { // Not me
              avatarContacts = [member];
              break;
            }
          }

          var left = <Avatar contacts={avatarContacts} />;

          var balances = account.balances.filter(function(balance) {
            return balance.value !== 0;
          });
          var right;

          if (balances.length) {
            var positives = [];
            var negatives = [];

            balances.forEach(function(balance) {
              var text = Math.abs(utils.roundAmount(balance.value)) + ' ' + utils.currencyMap[balance.currency];

              if(balance.value < 0) {
                negatives.push(
                  <div className="mui-font-style-title" key={balance.currency}>
                    {text}
                  </div>
                );
              } else { // > 0
                positives.push(
                  <div className="mui-font-style-title" key={balance.currency}>
                    {text}
                  </div>
                );
              }
            });

            right = [];

            if(negatives.length) {
              right.push(<div className="account-balance-you-owe" key="negatives">
                  <div className="mui-font-style-body-1">{polyglot.t('you_owe')}</div>
                  {negatives}
                </div>
              );
            }

            if(positives.length) {
              right.push(<div className="account-balance-owes-you" key="positives">
                  <div className="mui-font-style-body-1">{polyglot.t('owes_you')}</div>
                  {positives}
                </div>
              );
            }
          } else {
            right = <span className="account-balance-settled-up">{polyglot.t('settled_up')}</span>;
          }

          return <Paper key={account._id} zDepth={1} rounded={false}
                   onTouchTap={self.onTouchTapList.bind(self, account)}>
              <List left={left} right={right} className="mui-menu-item">
                {account.name}
              </List>
            </Paper>;
        })}
      </div>
      <div id="button-main">
        <FloatingActionButton
          iconClassName="md-add"
          secondary={true}
          onTouchTap={this.onTouchTapAddExpense} />
      </div>
    </AppCanvas>;
  }
});

module.exports = ListView;
