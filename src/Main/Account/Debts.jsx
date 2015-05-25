'use strict';

var React = require('react');
var Paper = require('material-ui/lib/paper');

var utils = require('../../utils');
var ListSubheader = require('../ListSubheader');
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

        return <div key={currency}>
          <ListSubheader subheader={currency} />
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
