'use strict';

var React = require('react');

var locale = require('../../locale');
var ContactChip = require('../ContactChip');

var styles = {
  root: {
    display: 'flex',
    padding: '8px 0',
  },
  left: {
    margin: 8,
  },
  center: {
    flexGrow: 1,
    textAlign: 'center',
  },
  svg: {
    height: 24,
    width: 84,
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
      <div style={styles.center}>
        <div>{amount}</div>
        <svg style={styles.svg}>
          <circle cx="25" cy="25" r="20" fill="#000" strokeWidth="2.5" strokeMiterlimit="10" />
        </svg>
      </div>
      <ContactChip contact={transfer.to} style={styles.rigth} />
    </div>;
  },
});

module.exports = AccountTransfer;
