'use strict';

var React = require('react');
var Paper = require('material-ui/lib/paper');
var _ = require('underscore');
var colors = require('material-ui/lib/styles/colors');

var polyglot = require('polyglot');
var utils = require('utils');
var locale = require('locale');
var ListSubheader = require('Main/ListSubheader');
var AccountBalanceChart = require('./BalanceChart');

var styles = {
  paper: {
    paddingRight: 5,
  },
  paperInner: {
    position: 'relative',
  },
  origin: {
    height: '100%',
    position: 'absolute',
    left: '75%',
    borderLeft: '1px dashed ' + colors.grey500,
  },
};

var AccountBalance = React.createClass({
  propTypes: {
    members: React.PropTypes.array.isRequired,
  },
  render: function() {
    var members = _.clone(this.props.members); // Sort is changing the array
    var currencies = utils.getCurrenciesWithMembers(members);

    return <div>
        {currencies.map(function(currency) {
          var max = 0;

          members.map(function(member) {
            var balance = _.findWhere(member.balances, { currency: currency });

            if (balance) { // If we add new members and a new currency, the balance is not set
              var value = Math.abs(balance.value);

              if (value > max) {
                max = value;
              }
            }
          });

          members.sort(function(member1, member2) {
            var balance1 = _.findWhere(member1.balances, { currency: currency });
            var balance2 = _.findWhere(member2.balances, { currency: currency });

            return balance1.value < balance2.value;
          });

          return <div key={currency}>
            {currencies.length > 1 && <ListSubheader subheader={polyglot.t('in_currency', {
              currency: locale.currencyToString(currency),
            })} />}
            <Paper style={styles.paper}>
              <div style={styles.paperInner}>
                <div style={styles.origin} />
                {members.map(function(member) {
                  return <AccountBalanceChart member={member} currency={currency} max={max} key={member.id} />;
                })}
              </div>
            </Paper>
          </div>;
        })}
      </div>;
  },
});

module.exports = AccountBalance;
