// @flow weak

import React, { PropTypes } from 'react';
import pure from 'recompose/pure';
import { createStyleSheet } from 'stylishly/lib/styleSheet';
import ImmutablePropTypes from 'react-immutable-proptypes';
import MemberAvatar from 'main/member/Avatar';
import accountUtils from 'main/account/utils';

const styleSheet = createStyleSheet('MemberChip', () => ({
  root: {
    display: 'flex',
    padding: 8,
    alignItems: 'center',
  },
  name: {
    paddingLeft: 8,
    fontSize: 13,
  },
}));

const styles = {
  avatar: {
    flexShrink: 0,
  },
};

const MemberChip = (props, context) => {
  const classes = context.styleManager.render(styleSheet);
  const {
    member,
    style,
  } = props;

  return (
    <span className={classes.root} style={style}>
      <MemberAvatar member={member} size={32} style={styles.avatar} />
      <span className={classes.name}>
        {accountUtils.getNameMember(member)}
      </span>
    </span>
  );
};

MemberChip.propTypes = {
  member: ImmutablePropTypes.map.isRequired,
  style: PropTypes.object,
};

MemberChip.contextTypes = {
  styleManager: PropTypes.object.isRequired,
};

export default pure(MemberChip);
