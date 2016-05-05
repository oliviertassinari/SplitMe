import React, {Component} from 'react';
import pure from 'recompose/pure';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Paper from 'material-ui-build/src/Paper';
import {grey500} from 'material-ui-build/src/styles/colors';
import Subheader from 'material-ui-build/src/Subheader';

import polyglot from 'polyglot';
import accountUtils from 'main/account/utils';
import AccountDetailBalanceChart from 'main/account/detail/BalanceChart';

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

class AccountDetailBalance extends Component {
  static propTypes = {
    members: ImmutablePropTypes.list.isRequired,
  };

  render() {
    let members = this.props.members;
    const currencies = accountUtils.getCurrenciesWithMembers(members);

    return (
      <div data-test="AccountDetailBalance">
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
                    <AccountDetailBalanceChart
                      key={member.get('id')}
                      member={member}
                      currency={currency}
                      max={max}
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

export default pure(AccountDetailBalance);
