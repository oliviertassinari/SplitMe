'use strict';

var React = require('react');

var utils = require('../utils');
var Avatar = require('./Avatar');

var ContactChip = React.createClass({
  propTypes: {
    contact: React.PropTypes.object.isRequired,
  },
  render: function() {
    var contact = this.props.contact;

    return <span>
      <Avatar contact={contact} size={32} />
      {utils.getDisplayName(contact)}
    </span>;
  },
});

module.exports = ContactChip;
