import React from 'react';
import pure from 'recompose/pure';
import Immutable from 'immutable';
import Paper from 'material-ui/src/paper';

import polyglot from 'polyglot';
import accountUtils from 'Main/Account/utils';
import expenseUtils from 'Main/Expense/utils';
import ListSubheader from 'Main/ListSubheader';
import Transfer from 'Main/Account/Transfer';
import AccountDebtsEmpty from 'Main/Account/DebtsEmpty';

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
                <ListSubheader
                  subheader={polyglot.t('in_currency', {
                    currency: item.currency,
                  })}
                />
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
