// @flow weak

import React, {Component} from 'react';
import pure from 'recompose/pure';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Paper from 'material-ui-build/src/Paper';
import Subheader from 'material-ui-build/src/Subheader';
import polyglot from 'polyglot';
import accountUtils from 'main/account/utils';
import expenseUtils from 'main/expense/utils';
import Transfer from 'main/account/Transfer';
import AccountDetailDebtsEmpty from './DebtsEmpty';

export class AccountDetailDebts extends Component {
  static propTypes = {
    members: ImmutablePropTypes.list.isRequired,
  };

  render() {
    const members = this.props.members;

    const list = accountUtils.getCurrenciesWithMembers(members)
      .map((currency) => {
        let max = 0;

        const transfers = accountUtils.getTransfersForSettlingMembers(members, currency)
          .filter((transfer) => {
            if (transfer.amount > max) {
              max = transfer.amount;
            }

            return expenseUtils.isSignificanAmount(transfer.amount);
          });

        return {
          currency: currency,
          transfers: transfers,
          max: max,
        };
      })
      .filter((item) => item.transfers.length > 0)
      // Sort DESC by max transfers value.
      .sort((itemA, itemB) => itemB.max - itemA.max);

    if (list.length === 0) {
      return <AccountDetailDebtsEmpty />;
    }

    return (
      <div data-test="AccountDetailDebts">
        {list.map((item) => (
          <div key={item.currency}>
            {list.length > 1 &&
              <Subheader data-test="Subheader">
                {polyglot.t('in_currency', {
                  currency: item.currency,
                })}
              </Subheader>
            }
            <Paper rounded={false}>
              {item.transfers.map((transfer, index) => (
                <Transfer key={index} transfer={transfer} />
              ))}
            </Paper>
          </div>
        ))}
      </div>
    );
  }
}

export default pure(AccountDetailDebts);
