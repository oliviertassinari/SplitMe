'use strict';

var React = require('react');
var Paper = require('material-ui/lib/paper');

var utils = require('../../utils');
var ContactChip = require('../ContactChip');
var ListSubheader = require('../ListSubheader');

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
              return <div key={index}>
                <ContactChip contact={transfer.from} />
                {transfer.amount}
                <ContactChip contact={transfer.to} />
              </div>;
            })}
          </Paper>
        </div>;
      })}
    </div>;
  },
});

module.exports = AccountDebts;
