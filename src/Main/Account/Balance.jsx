import React from 'react';
import Immutable from 'immutable';
import Paper from 'material-ui/lib/paper';
import colors from 'material-ui/lib/styles/colors';

import polyglot from 'polyglot';
import accountUtils from 'Main/Account/utils';
import locale from 'locale';
import ListSubheader from 'Main/ListSubheader';
import AccountBalanceChart from 'Main/Account/BalanceChart';

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
  render() {
    let members = this.props.members;
    const currencies = accountUtils.getCurrenciesWithMembers(members);

    return (
      <div data-test="AccountBalance">
        {currencies.map((currency) => {
          let max = 0;

          // Sort DESC by balance value
          members = members.sortBy((member) => {
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
          }, (valueA, valueB) => {
            return valueA < valueB;
          });

          return (
            <div key={currency}>
              {currencies.length > 1 && <ListSubheader subheader={polyglot.t('in_currency', {
                currency: locale.currencyToString(currency),
              })} />}
              <Paper rounded={false} style={styles.paper}>
                <div style={styles.paperInner}>
                  <div style={styles.origin} />
                  {members.map((member) => {
                    return <AccountBalanceChart member={member} currency={currency} max={max} key={member.get('id')} />;
                  })}
                </div>
              </Paper>
            </div>
          );
        })}
      </div>
    );
  },
});

export default AccountBalance;
