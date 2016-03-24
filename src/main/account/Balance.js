import React from 'react';
import Immutable from 'immutable';
import Paper from 'material-ui/src/Paper';
import {grey500} from 'material-ui/src/styles/colors';
import Subheader from 'material-ui/src/Subheader';

import polyglot from 'polyglot';
import accountUtils from 'main/account/utils';
import AccountBalanceChart from 'main/account/BalanceChart';

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
    borderLeft: `1px dashed ${grey500}`,
  },
};

class AccountBalance extends React.Component {
  static propTypes = {
    members: React.PropTypes.instanceOf(Immutable.List).isRequired,
  };

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
            if (valueA > valueB) {
              return -1;
            } else if (valueA === valueB) {
              return 0;
            } else {
              return 1;
            }
          });

          return (
            <div key={currency}>
              {currencies.length > 1 &&
                <Subheader data-test="Subheader">
                  {polyglot.t('in_currency', {
                    currency: currency,
                  })}
                </Subheader>
              }
              <Paper rounded={false} style={styles.paper}>
                <div style={styles.paperInner}>
                  <div style={styles.origin} />
                  {members.map((member) => (
                    <AccountBalanceChart
                      member={member} currency={currency} max={max}
                      key={member.get('id')}
                    />
                  ))}
                </div>
              </Paper>
            </div>
          );
        })}
      </div>
    );
  }
}

export default AccountBalance;
