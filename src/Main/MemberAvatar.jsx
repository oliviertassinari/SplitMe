'use strict';

var React = require('react/addons');
var Immutable = require('immutable');
var Avatar = require('material-ui/lib/avatar');

var utils = require('utils');

var MemberAvatar = React.createClass({
  propTypes: {
    member: React.PropTypes.instanceOf(Immutable.Map).isRequired,
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
    var props = this.props;

    if (props.member.get('photo')) {
      return <Avatar src={props.member.get('photo')} style={props.style} size={props.size} />;
    } else {
      var name = utils.getNameMember(props.member);

      return <Avatar backgroundColor={this.stringToColour(name)}
        style={props.style} size={props.size}>
          {name.charAt(0).toUpperCase()}
        </Avatar>;
    }
  },
});

module.exports = MemberAvatar;
