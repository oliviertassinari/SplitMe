'use strict';

var React = require('react');
var Paper = require('material-ui/lib/paper');

var polyglot = require('polyglot');
var utils = require('utils');
var locale = require('locale');
var ListSubheader = require('Main/ListSubheader');
var Transfer = require('./Transfer');

var AccountDebts = React.createClass({
  propTypes: {
    members: React.PropTypes.array.isRequired,
  },
  render: function() {
    var members = this.props.members;
    var currencies = utils.getCurrenciesWithMembers(members);

    var list = currencies.map(function(currency) {
      return {
        currency: currency,
        transfers: utils.getTransfersForSettlingMembers(members, currency),
      };
    })
    .filter(function(item) {
      return item.transfers.length;
    });

    return <div>
      {list.map(function(item) {
        return <div key={item.currency}>
          {list.length > 1 && <ListSubheader subheader={polyglot.t('in_currency', {
            currency: locale.currencyToString(item.currency)
          })} />}
          <Paper>
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
