'use strict';

var React = require('react');

var ContactChip = require('../ContactChip');

var styles = {
  root: {
    display: 'flex',
  }
};

var AccountTransfer = React.createClass({
  propTypes: {
    transfer: React.PropTypes.object.isRequired,
  },
  render: function() {
    var transfer = this.props.transfer;

    return <div style={styles.root}>
      <ContactChip contact={transfer.from} />
      {transfer.amount}
      <ContactChip contact={transfer.to} />
    </div>;
  },
});

module.exports = AccountTransfer;
