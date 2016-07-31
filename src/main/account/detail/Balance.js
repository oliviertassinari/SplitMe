// @flow weak

import React, {Component, PropTypes} from 'react';
import pure from 'recompose/pure';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {createStyleSheet} from 'stylishly/lib/styleSheet';
import Paper from 'material-ui-build/src/Paper';
import {grey500} from 'material-ui-build/src/styles/colors';
import Subheader from 'material-ui-build/src/Subheader';
import polyglot from 'polyglot';
import accountUtils from 'main/account/utils';
import AccountDetailBalanceChart from 'main/account/detail/BalanceChart';

const styleSheet = createStyleSheet('AccountDetailBalance', () => ({
  paperInner: {
    position: 'relative',
  },
  origin: {
    height: '100%',
    position: 'absolute',
    left: '75%',
    borderLeft: `1px dashed ${grey500}`,
  },
}));

export class AccountDetailBalance extends Component {
  static propTypes = {
    members: ImmutablePropTypes.list.isRequired,
  };

  static contextTypes = {
    styleManager: PropTypes.object.isRequired,
  };

  render() {
    const classes = this.context.styleManager.render(styleSheet);

    const membersProp = this.props.members;
    const list = accountUtils.getCurrenciesWithMembers(membersProp)
      .map((currency) => {
        let max = 0;

        // Sort DESC by balance value
        const members = membersProp.sortBy(
          (member) => {
            const balance = accountUtils.getMemberBalance(member, currency);

            if (balance) { // If we add new members and a new currency, the balance is not set
              // Compute the max value
              const value = Math.abs(balance.get('value'));

              if (value > max + 0) {
                max = value;
              }

              return balance.get('value');
            } else {
              return 0;
            }
          },
          (valueA, valueB) => valueB - valueA
        );

        return {
          currency: currency,
          members: members,
          max: max,
        };
      })
      // Sort DESC by max transfers value.
      .sort((itemA, itemB) => itemB.max - itemA.max);

    return (
      <div data-test="AccountDetailBalance">
        {list.map((item) => {
          return (
            <div key={item.currency}>
              {list.length > 1 &&
                <Subheader data-test="Subheader">
                  {polyglot.t('in_currency', {
                    currency: item.currency,
                  })}
                </Subheader>
              }
              <Paper rounded={false}>
                <div className={classes.paperInner}>
                  <div className={classes.origin} />
                  {item.members.map((member) => (
                    <AccountDetailBalanceChart
                      key={member.get('id')}
                      member={member}
                      currency={item.currency}
                      max={item.max}
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
