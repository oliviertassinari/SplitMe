// @flow weak

import React, { PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Avatar from 'material-ui-build/src/Avatar';
import pure from 'recompose/pure';
import accountUtils from 'main/account/utils';

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let colour = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xFF;
    colour += (`00${value.toString(16)}`).substr(-2);
  }
  /* eslint-enable no-bitwise */

  return colour;
}

const MemberAvatar = (props) => {
  const {
    member,
    size,
    ...other
  } = props;

  if (member.get('photo')) {
    return <Avatar src={member.get('photo')} size={size} {...other} />;
  }

  const name = accountUtils.getNameMember(member);

  return (
    <Avatar
      backgroundColor={stringToColor(name)}
      size={size}
      {...other}
    >
      {name.charAt(0).toUpperCase()}
    </Avatar>
  );
};

MemberAvatar.propTypes = {
  member: ImmutablePropTypes.shape({
    photo: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  size: PropTypes.number,
};

MemberAvatar.defaultProps = {
  size: 40,
};

export default pure(MemberAvatar);
