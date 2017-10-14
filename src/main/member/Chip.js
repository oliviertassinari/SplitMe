
import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import { createStyleSheet } from 'jss-theme-reactor';
import ImmutablePropTypes from 'react-immutable-proptypes';
import withStyles from 'material-ui-build-next/src/styles/withStyles';
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

const MemberChip = (props) => {
  const {
    classes,
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
  classes: PropTypes.object.isRequired,
  member: ImmutablePropTypes.map.isRequired,
  style: PropTypes.object,
};

export default compose(
  pure,
  withStyles(styleSheet),
)(MemberChip);
