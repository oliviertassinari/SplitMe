import React, {PropTypes, Component} from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Avatar from 'material-ui-build/src/Avatar';
import pure from 'recompose/pure';

import accountUtils from 'main/account/utils';

class MemberAvatar extends Component {
  static propTypes = {
    member: ImmutablePropTypes.shape({
      photo: PropTypes.string,
      name: PropTypes.string,
    }).isRequired,
    size: PropTypes.number,
    style: PropTypes.object,
  };

  static defaultProps = {
    size: 40,
  };

  stringToColor(string) {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let colour = '#';

    for (i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xFF;
      colour += (`00${value.toString(16)}`).substr(-2);
    }

    return colour;
  }

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
        <Avatar
          backgroundColor={this.stringToColor(name)}
          style={style}
          size={size}
        >
          {name.charAt(0).toUpperCase()}
        </Avatar>
      );
    }
  }
}

export default pure(MemberAvatar);
