'use strict';

var React = require('react');
var Paper = require('material-ui/lib/paper');

var utils = require('../../utils');
var Avatar = require('../Avatar');

var AccountDebts = React.createClass({
  propTypes: {
    members: React.PropTypes.array.isRequired,
  },
  render: function() {
    var members = this.props.members;
    var transfers = utils.getTransfersForSettlingMembers(members, 'EUR');

    return <Paper>
      {transfers.map(function(transfer, index) {
        return <div key={index}>
          <Avatar contact={transfer.from} />
          {transfer.amount}
          <Avatar contact={transfer.to} />
        </div>;
      })}
    </Paper>;
  },
});

module.exports = AccountDebts;
