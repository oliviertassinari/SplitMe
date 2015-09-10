'use strict';

const React = require('react');
const Immutable = require('immutable');
const Paper = require('material-ui/lib/paper');
const colors = require('material-ui/lib/styles/colors');

const polyglot = require('polyglot');
const accountUtils = require('Main/Account/utils');
const locale = require('locale');
const ListSubheader = require('Main/ListSubheader');
const AccountBalanceChart = require('Main/Account/BalanceChart');

const styles = {
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

const AccountBalance = React.createClass({
  propTypes: {
    members: React.PropTypes.instanceOf(Immutable.List).isRequired,
  },
  render: function() {
    let members = this.props.members;
    const currencies = accountUtils.getCurrenciesWithMembers(members);

    return <div>
        {currencies.map(function(currency) {
          let max = 0;

          // Sort DESC by balance value
          members = members.sortBy(function(member) {
            const balance = accountUtils.getMemberBalance(member, currency);

            if (balance) { // If we add new members and a new currency, the balance is not set
              // Compute the max value
              const value = Math.abs(balance.get('value'));

              if (value > max) {
                max = value;
              }

              return balance.get('value');
            } else {
              return 0;
            }
          }, function(valueA, valueB) {
            return valueA < valueB;
          });

          return <div key={currency}>
              {currencies.length > 1 && <ListSubheader subheader={polyglot.t('in_currency', {
                currency: locale.currencyToString(currency),
              })} />}
              <Paper rounded={false} style={styles.paper}>
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
