'use strict';

var React = require('react');
var StylePropable = require('material-ui/lib/mixins/style-propable');

var utils = require('../utils');
var Avatar = require('./Avatar');

var styles = {
  root: {
    display: 'flex',
    padding: 8,
  },
  avatar: {
    flexShrink: 0,
  },
  name: {
    paddingLeft: 8,
    fontSize: 14,
  },
};

var ContactChip = React.createClass({
  propTypes: {
    contact: React.PropTypes.object.isRequired,
    style: React.PropTypes.object,
  },
  mixins: [
    StylePropable,
  ],
  render: function() {
    var contact = this.props.contact;

    return <span style={this.mergeAndPrefix(styles.root, this.props.style)}>
      <Avatar style={styles.avatar} contact={contact} size={32} />
      <span style={styles.name}>{utils.getDisplayName(contact)}</span>
    </span>;
  },
});

module.exports = ContactChip;
