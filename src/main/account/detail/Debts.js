import React, {PropTypes, Component} from 'react';
import pure from 'recompose/pure';
import Immutable from 'immutable';
import Paper from 'material-ui-build/src/Paper';
import Subheader from 'material-ui-build/src/Subheader';

import polyglot from 'polyglot';
import accountUtils from 'main/account/utils';
import expenseUtils from 'main/expense/utils';
import Transfer from 'main/account/Transfer';
import AccountDetailDebtsEmpty from 'main/account/detail/DebtsEmpty';

class AccountDebts extends Component {
  static propTypes = {
    members: PropTypes.instanceOf(Immutable.List).isRequired,
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

export default pure(AccountDebts);
