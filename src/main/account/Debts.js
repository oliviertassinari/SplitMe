import React from 'react';
import pure from 'recompose/pure';
import Immutable from 'immutable';
import Paper from 'material-ui/src/paper';
import Subheader from 'material-ui/src/Subheader';

import polyglot from 'polyglot';
import accountUtils from 'main/account/utils';
import expenseUtils from 'main/expense/utils';
import Transfer from 'main/account/Transfer';
import AccountDebtsEmpty from 'main/account/DebtsEmpty';

class AccountDebts extends React.Component {
  static propTypes = {
    members: React.PropTypes.instanceOf(Immutable.List).isRequired,
  };

  render() {
    const members = this.props.members;
    const currencies = accountUtils.getCurrenciesWithMembers(members);

    const list = currencies.map((currency) => {
      const transfers = accountUtils.getTransfersForSettlingMembers(members, currency)
        .filter((transfer) => {
          return expenseUtils.isSignificanAmount(transfer.amount);
        });

      return {
        currency: currency,
        transfers: transfers,
      };
    }).filter((item) => {
      return item.transfers.length > 0;
    });

    if (list.length === 0) {
      return <AccountDebtsEmpty />;
    }

    return (
      <div data-test="AccountDebts">
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
                {item.transfers.map((transfer, index) => {
                  return <Transfer key={index} transfer={transfer} />;
                })}
              </Paper>
            </div>
          );
        })}
      </div>
    );
  }
}

export default pure(AccountDebts);
