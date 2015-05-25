'use strict';

var React = require('react');

var utils = require('../utils');
var Avatar = require('./Avatar');

var styles = {
  root: {
    display: 'flex',
    padding: 8,
  },
  name: {
    paddingLeft: 8,
  },
};

var ContactChip = React.createClass({
  propTypes: {
    contact: React.PropTypes.object.isRequired,
  },
  render: function() {
    var contact = this.props.contact;

    return <span style={styles.root}>
      <Avatar contact={contact} size={32} />
      <span style={styles.name}>{utils.getDisplayName(contact)}</span>
    </span>;
  },
});

module.exports = ContactChip;
