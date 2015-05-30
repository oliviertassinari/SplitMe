'use strict';

var React = require('react');
var _ = require('underscore');
var Paper = require('material-ui/lib/paper');

var polyglot = require('polyglot');
var utils = require('utils');
var locale = require('locale');
var List = require('Main/List');
var ListSubheader = require('Main/ListSubheader');
var Avatar = require('Main/Avatar');
var AccountBalanceChart = require('./BalanceChart');

var AccountBalance = React.createClass({
  propTypes: {
    members: React.PropTypes.array.isRequired,
  },
  render: function() {
    var members = this.props.members;
    var currencies = utils.getCurrenciesWithMembers(members);

    var currenciesScale = {};

    currencies.map(function(currency) {
      var scale = 0;

      members.map(function(member) {
        var balance = _.findWhere(member.balances, { currency: currency });
        var value = Math.abs(balance.value);

        if (value > scale) {
          scale = value;
        }
      });

      currenciesScale[currency] = scale;
    });

    return <div>
        {currencies.map(function(currency) {
          var scale = currenciesScale[currency];

          return <div key={currency}>
            {currencies.length > 1 && <ListSubheader subheader={polyglot.t('in_currency', {
              currency: locale.currencyToString(currency)
            })} />}
            <Paper>
              {members.map(function(member) {
                var balance = _.findWhere(member.balances, { currency: currency });

                var avatar = <Avatar contact={member} />;
                var accountBalanceChart = <AccountBalanceChart value={balance.value} scale={scale}
                  currency={currency} />;

                return <List key={member.id} left={avatar} right={accountBalanceChart}>
                  {utils.getDisplayName(member)}
                </List>;
              })}
            </Paper>
          </div>;
        })}
      </div>;
  },
});

module.exports = AccountBalance;
