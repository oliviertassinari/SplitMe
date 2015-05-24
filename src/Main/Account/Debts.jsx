'use strict';

var React = require('react');
var Paper = require('material-ui/lib/paper');

var utils = require('../../utils');

var AccountDebts = React.createClass({
  propTypes: {
    members: React.PropTypes.array.isRequired,
  },
  render: function() {
    var members = this.props.members;
    var transfers = utils.getTransfersForSettlingMembers(members, 'EUR');

    console.log(members, transfers);

    return <Paper>

    </Paper>;
  },
});

module.exports = AccountDebts;
