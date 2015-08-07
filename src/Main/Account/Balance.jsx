'use strict';

var React = require('react');
var Immutable = require('immutable');
var Paper = require('material-ui/lib/paper');
var colors = require('material-ui/lib/styles/colors');

var polyglot = require('polyglot');
var utils = require('utils');
var locale = require('locale');
var ListSubheader = require('Main/ListSubheader');
var AccountBalanceChart = require('Main/Account/BalanceChart');

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
    members: React.PropTypes.instanceOf(Immutable.List).isRequired,
  },
  render: function() {
    var members = this.props.members;
    var currencies = utils.getCurrenciesWithMembers(members);

    return <div>
        {currencies.map(function(currency) {
          var max = 0;

          // Sort DESC by balance value
          members = members.sortBy(function(member) {
            var balance = utils.getMemberBalance(member, currency);

            if (balance) { // If we add new members and a new currency, the balance is not set
              // Compute the max value
              var value = Math.abs(balance.get('value'));

              if (value > max) {
                max = value;
              }
            }

            return balance.get('value');
          }, function(valueA, valueB) {
            return valueA < valueB;
          });

          return <div key={currency}>
              {currencies.length > 1 && <ListSubheader subheader={polyglot.t('in_currency', {
                currency: locale.currencyToString(currency),
              })} />}
              <Paper style={styles.paper}>
                <div style={styles.paperInner}>
                  <div style={styles.origin} />
                  {members.map(function(member) {
                    return <AccountBalanceChart member={member} currency={currency} max={max} key={member.get('id')} />;
                  })}
                </div>
              </Paper>
            </div>;
        })}
      </div>;
  },
});

module.exports = AccountBalance;
