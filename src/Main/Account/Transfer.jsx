'use strict';

var React = require('react');

var locale = require('../../locale');
var ContactChip = require('../ContactChip');

var styles = {
  root: {
    display: 'flex',
  },
  left: {
    margin: 8,
  },
  center: {
    flexGrow: 1,
    textAlign: 'center',
  },
  rigth: {
    margin: 8,
  },
};

var AccountTransfer = React.createClass({
  propTypes: {
    transfer: React.PropTypes.object.isRequired,
  },
  render: function() {
    var transfer = this.props.transfer;

    var amount = new locale.intl.NumberFormat(locale.current, { style: 'currency', currency: transfer.currency })
      .format(transfer.amount);

    return <div style={styles.root}>
      <ContactChip contact={transfer.from} style={styles.left} />
      <span style={styles.center}>{amount}</span>
      <ContactChip contact={transfer.to} style={styles.rigth} />
    </div>;
  },
});

module.exports = AccountTransfer;
