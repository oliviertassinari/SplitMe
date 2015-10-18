'use strict';

const React = require('react');
const PureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');
const Immutable = require('immutable');
const Paper = require('material-ui/src/paper');

const polyglot = require('polyglot');
const accountUtils = require('Main/Account/utils');
const locale = require('locale');
const ListSubheader = require('Main/ListSubheader');
const Transfer = require('Main/Account/Transfer');

const AMOUNT_TO_PEN = 100;

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
          return Math.round(transfer.amount * AMOUNT_TO_PEN) !== 0;
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

module.exports = AccountDebts;
