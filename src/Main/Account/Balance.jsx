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
    var members = this.props.members;
    var currencies = utils.getCurrenciesWithMembers(members);

    return <div>
        {currencies.map(function(currency) {
          var scale = 0;

          members.map(function(member) {
            var balance = _.findWhere(member.balances, { currency: currency });
            var value = Math.abs(balance.value);

            if (value > scale) {
              scale = value;
            }
          });

          return <div key={currency}>
            {currencies.length > 1 && <ListSubheader subheader={polyglot.t('in_currency', {
              currency: locale.currencyToString(currency)
            })} />}
            <Paper style={styles.paper} className="testAccountBalanceChart">
              <div style={styles.paperInner}>
                <div style={styles.origin} />
                {members.map(function(member) {
                  return <AccountBalanceChart member={member} currency={currency} scale={scale} key={member.id} />;
                })}
              </div>
            </Paper>
          </div>;
        })}
      </div>;
  },
});

module.exports = AccountBalance;
