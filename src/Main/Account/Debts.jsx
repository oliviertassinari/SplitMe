import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Immutable from 'immutable';
import Paper from 'material-ui/lib/paper';

import polyglot from 'polyglot';
import accountUtils from 'Main/Account/utils';
import expenseUtils from 'Main/Expense/utils';
import locale from 'locale';
import ListSubheader from 'Main/ListSubheader';
import Transfer from 'Main/Account/Transfer';

const AccountDebts = React.createClass({
  propTypes: {
    members: React.PropTypes.instanceOf(Immutable.List).isRequired,
  },
  mixins: [
    PureRenderMixin,
  ],
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

    return (
      <div data-test="AccountDebts">
        {list.map((item) => {
          return (
            <div key={item.currency}>
              {list.length > 1 && <ListSubheader subheader={polyglot.t('in_currency', {
                currency: locale.currencyToString(item.currency),
              })} />}
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
  },
});

export default AccountDebts;
