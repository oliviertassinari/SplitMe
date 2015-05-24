'use strict';

var React = require('react');
var Paper = require('material-ui/lib/paper');

var AccountBalance = React.createClass({
  propTypes: {
    members: React.PropTypes.array.isRequired,
  },
  render: function() {
    var members = this.props.members;

    console.log(members);

    return <Paper>

    </Paper>;
  },
});

module.exports = AccountBalance;
