'use strict';

var React = require('react');
var StylePropable = require('material-ui/lib/mixins/style-propable');

var utils = require('utils');
var MemberAvatar = require('./MemberAvatar');

var styles = {
  root: {
    display: 'flex',
    padding: 8,
    alignItems: 'center',
  },
  avatar: {
    flexShrink: 0,
  },
  name: {
    paddingLeft: 8,
    fontSize: 13,
  },
};

var MemberChip = React.createClass({
  propTypes: {
    member: React.PropTypes.object.isRequired,
    style: React.PropTypes.object,
  },
  mixins: [
    StylePropable,
  ],
  render: function() {
    var member = this.props.member;

    return <span style={this.mergeAndPrefix(styles.root, this.props.style)}>
      <MemberAvatar member={member} size={32} style={styles.avatar} />
      <span style={styles.name}>{utils.getNameMember(member)}</span>
    </span>;
  },
});

module.exports = MemberChip;
