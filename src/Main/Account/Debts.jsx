'use strict';

var React = require('react');
var Immutable = require('immutable');
var Paper = require('material-ui/lib/paper');

var polyglot = require('polyglot');
var accountUtils = require('Main/Account/utils');
var locale = require('locale');
var ListSubheader = require('Main/ListSubheader');
var Transfer = require('Main/Account/Transfer');

var AccountDebts = React.createClass({
  propTypes: {
    members: React.PropTypes.instanceOf(Immutable.List).isRequired,
  },
  mixins: [
    React.addons.PureRenderMixin,
  ],
  render: function() {
    var members = this.props.members;
    var currencies = accountUtils.getCurrenciesWithMembers(members);

    var list = currencies.map(function(currency) {
        var transfers = accountUtils.getTransfersForSettlingMembers(members, currency)
          .filter(function(transfer) {
            return Math.round(transfer.amount * 100) !== 0;
          });

        return {
          currency: currency,
          transfers: transfers,
        };
      })
      .filter(function(item) {
        return item.transfers.length > 0;
      });

    return <div>
        {list.map(function(item) {
          return <div key={item.currency}>
            {list.length > 1 && <ListSubheader subheader={polyglot.t('in_currency', {
              currency: locale.currencyToString(item.currency),
            })} />}
            <Paper rounded={false}>
              {item.transfers.map(function(transfer, index) {
                return <Transfer key={index} transfer={transfer} />;
              })}
            </Paper>
          </div>;
        })}
      </div>;
  },
});

module.exports = AccountDebts;
