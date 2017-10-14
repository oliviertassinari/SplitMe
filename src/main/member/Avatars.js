import React, { PropTypes } from 'react';
import classNames from 'classnames';
import ImmutablePropTypes from 'react-immutable-proptypes';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import { createStyleSheet } from 'jss-theme-reactor';
import withStyles from 'material-ui-build-next/src/styles/withStyles';
import MemberAvatar from 'main/member/Avatar';

const styleSheet = createStyleSheet('MemberAvatars', () => ({
  root: {
    borderRadius: '50%',
    height: 40,
    width: 40,
    overflow: 'hidden',
    position: 'relative',
    zIndex: 0,
  },
}));

const styles = {
  square: {
    position: 'absolute',
    top: 0,
    overflow: 'hidden',
  },
  squareInner: {
    position: 'absolute',
    borderRadius: 0,
  },
};

const stylesExtended = {
  squareLeft: Object.assign({}, styles.square, {
    width: 20,
    height: 40,
  }),
  squareRight: Object.assign({}, styles.square, {
    left: 21,
    width: 20,
    height: 40,
  }),
  squareInnerCenter: Object.assign({}, styles.squareInner, {
    left: -10,
  }),
  squareInnerTop: Object.assign({}, styles.square, styles.squareInner, {
    left: 21,
  }),
  squareInnerBottom: Object.assign({}, styles.square, styles.squareInner, {
    top: 21,
    left: 21,
  }),
};

const MemberAvatars = props => {
  const { classes, className, members } = props;

  switch (members.size) {
    case 1:
      return <MemberAvatar member={members.get(0)} className={className} />;

    case 2:
      return <MemberAvatar member={members.get(1)} className={className} />;

    case 3:
      return (
        <div className={classNames(classes.root, className)}>
          <div style={stylesExtended.squareLeft}>
            <MemberAvatar member={members.get(1)} style={stylesExtended.squareInnerCenter} />
          </div>
          <div style={stylesExtended.squareRight}>
            <MemberAvatar member={members.get(2)} style={stylesExtended.squareInnerCenter} />
          </div>
        </div>
      );

    case 4:
    default:
      return (
        <div className={classNames(classes.root, className)}>
          <div style={stylesExtended.squareLeft}>
            <MemberAvatar member={members.get(1)} style={stylesExtended.squareInnerCenter} />
          </div>
          <MemberAvatar member={members.get(2)} size={20} style={stylesExtended.squareInnerTop} />
          <MemberAvatar
            member={members.get(3)}
            size={20}
            style={stylesExtended.squareInnerBottom}
          />
        </div>
      );
  }
};

MemberAvatars.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  members: ImmutablePropTypes.list.isRequired,
};

export default compose(pure, withStyles(styleSheet))(MemberAvatars);
