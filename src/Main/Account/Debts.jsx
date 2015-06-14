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

    return <div>
      {currencies.map(function(currency) {
        var transfers = utils.getTransfersForSettlingMembers(members, currency);

        if (transfers.length === 0) {
          return null;
        }

        return <div key={currency}>
          {currencies.length > 1 && <ListSubheader subheader={polyglot.t('in_currency', {
            currency: locale.currencyToString(currency)
          })} />}
          <Paper>
            {transfers.map(function(transfer, index) {
              return <Transfer key={index} transfer={transfer} />;
            })}
          </Paper>
        </div>;
      })}
    </div>;
  },
});

module.exports = AccountDebts;
