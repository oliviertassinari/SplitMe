'use strict';

var React = require('react/addons');
var Immutable = require('immutable');
var Avatar = require('material-ui/lib/avatar');

var accountUtils = require('Main/Account/utils');

var MemberAvatar = React.createClass({
  propTypes: {
    member: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    size: React.PropTypes.number,
    style: React.PropTypes.object,
  },
  mixins: [
    React.addons.PureRenderMixin,
  ],
  getDefaultProps: function() {
    return {
      size: 40,
    };
  },
  stringToColor: function(string) {
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

    var style = props.style;

    if (!style) {
      style = {};
    }

    style.display = 'block';

    if (props.member.get('photo')) {
      return <Avatar src={props.member.get('photo')} style={style} size={props.size} />;
    } else {
      var name = accountUtils.getNameMember(props.member);

      return <Avatar backgroundColor={this.stringToColor(name)}
        style={style} size={props.size}>
          {name.charAt(0).toUpperCase()}
        </Avatar>;
    }
  },
});

module.exports = MemberAvatar;
