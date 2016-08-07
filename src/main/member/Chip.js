// @flow weak

import React, {PropTypes} from 'react';
import pure from 'recompose/pure';
import ImmutablePropTypes from 'react-immutable-proptypes';
import MemberAvatar from 'main/member/Avatar';
import accountUtils from 'main/account/utils';

const styles = {
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

const MemberChip = (props) => {
  const {
    member,
    style,
  } = props;

  return (
    <span style={Object.assign({}, styles.root, style)}>
      <MemberAvatar member={member} size={32} style={styles.avatar} />
      <span style={styles.name}>
        {accountUtils.getNameMember(member)}
      </span>
    </span>
  );
};

MemberChip.propTypes = {
  member: ImmutablePropTypes.map.isRequired,
  style: PropTypes.object,
};

export default pure(MemberChip);
