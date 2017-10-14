import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import { withStyles } from 'material-ui-next/styles';
import ImmutablePropTypes from 'react-immutable-proptypes';
import MemberAvatar from 'main/member/Avatar';
import accountUtils from 'main/account/utils';

const styles = {
  root: {
    display: 'flex',
    padding: 8,
    alignItems: 'center',
  },
  name: {
    paddingLeft: 8,
    fontSize: 13,
  },
};

const inlineStyles = {
  avatar: {
    flexShrink: 0,
  },
};

const MemberChip = props => {
  const { classes, member, style } = props;

  return (
    <span className={classes.root} style={style}>
      <MemberAvatar member={member} size={32} style={inlineStyles.avatar} />
      <span className={classes.name}>{accountUtils.getNameMember(member)}</span>
    </span>
  );
};

MemberChip.propTypes = {
  classes: PropTypes.object.isRequired,
  member: ImmutablePropTypes.map.isRequired,
  style: PropTypes.object,
};

export default compose(pure, withStyles(styles))(MemberChip);
