import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Immutable from 'immutable';
import Avatar from 'material-ui/lib/avatar';

import accountUtils from 'Main/Account/utils';

const MemberAvatar = React.createClass({
  propTypes: {
    member: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    size: React.PropTypes.number,
    style: React.PropTypes.object,
  },
  mixins: [
    PureRenderMixin,
  ],
  getDefaultProps() {
    return {
      size: 40,
    };
  },
  stringToColor(string) {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let colour = '#';

    for (i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xFF;
      colour += ('00' + value.toString(16)).substr(-2);
    }

    return colour;
  },
  render() {
    const {
      member,
      size,
    } = this.props;

    let style = this.props.style;

    if (!style) {
      style = {};
    }

    style.display = 'block';

    if (member.get('photo')) {
      return <Avatar src={member.get('photo')} style={style} size={size} />;
    } else {
      const name = accountUtils.getNameMember(member);

      return (
        <Avatar backgroundColor={this.stringToColor(name)}
          style={style} size={size}>
          {name.charAt(0).toUpperCase()}
        </Avatar>
      );
    }
  },
});

export default MemberAvatar;
