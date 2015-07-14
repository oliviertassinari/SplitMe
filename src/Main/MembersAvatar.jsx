'use strict';

var React = require('react/addons');
var Avatar = require('material-ui/lib/avatar');

var utils = require('utils');

var MembersAvatar = React.createClass({
  propTypes: {
    member: React.PropTypes.object,
    members: React.PropTypes.array,
    style: React.PropTypes.object,
    size: React.PropTypes.number,
  },
  mixins: [
    React.addons.PureRenderMixin,
  ],
  getDefaultProps: function() {
    return {
      size: 40,
    };
  },
  stringToColour: function(string) {
    var hash = 0;
    var i;

    for (i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    var colour = '#';

    for (i = 0; i < 3; i++) {
      var value = (hash >> (i * 8)) & 0xFF;
      colour += ('00' + value.toString(16)).substr(-2);
    }

    return colour;
  },
  render: function() {
    var member;
    var props = this.props;

    if (props.members) {
      member = props.members[1]; // Index 0 is always me
    } else if (props.member) {
      member = props.member;
    } else {
      console.warn('missing member');
    }

    if (member.photo) {
      return <Avatar src={member.photo} style={props.style} size={props.size} />;
    } else {
      var displayName = utils.getDisplayNameMember(member);

      return <Avatar backgroundColor={this.stringToColour(displayName)}
        style={props.style} size={props.size}>
          {displayName.charAt(0).toUpperCase()}
        </Avatar>;
    }
  },
});

module.exports = MembersAvatar;
