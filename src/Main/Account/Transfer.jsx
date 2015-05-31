'use strict';

var React = require('react');

var locale = require('locale');
var ContactChip = require('Main/ContactChip');

var styles = {
  root: {
    display: 'flex',
    padding: '14px 0 8px',
  },
  satelite: {
    margin: '8px 0 0 0',
    width: '33%',
  },
  center: {
    textAlign: 'center',
    width: '33%',
    fontSize: 18,
  },
  svg: {
    height: 20,
    width: 70,
    marginTop: 2,
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
        <ContactChip contact={transfer.from} style={styles.satelite} />
        <div style={styles.center}>
          <div>{amount}</div>
          <svg style={styles.svg} viewBox="0 0 84 24">
            <path d="m70.4 4c-0.4 0.4-0.4 1.1 0 1.6l5.2 5.2 -70 0c-0.6 0-1.1 0.5-1.1 1.1 0 0.6 0.5 1.1 1.1 1.1l70 0 -5.2 5.2c-0.4 0.4-0.4 1.1 0 1.6 0.4 0.4 1.1 0.4 1.6 0l7.1-7.1c0.2-0.2 0.3-0.5 0.3-0.8s-0.1-0.6-0.3-0.8l-7.1-7.1c-0.4-0.4-1.1-0.4-1.6 0l0 0z"/>
          </svg>
        </div>
        <ContactChip contact={transfer.to} style={styles.satelite} />
      </div>;
  },
});

module.exports = AccountTransfer;
