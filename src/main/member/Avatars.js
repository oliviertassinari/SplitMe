// @flow weak

import React, {PropTypes} from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import pure from 'recompose/pure';
import {createStyleSheet} from 'stylishly/lib/styleSheet';
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

const MemberAvatars = (props, context) => {
  const classes = context.styleManager.render(styleSheet);
  const {
    style,
    members,
  } = props;

  switch (members.size) {
    case 1:
      return <MemberAvatar style={style} member={members.get(0)} />;

    case 2:
      return <MemberAvatar style={style} member={members.get(1)} />;

    case 3:
      return (
        <div className={classes.root} style={style}>
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
        <div className={classes.root} style={style}>
          <div style={stylesExtended.squareLeft}>
            <MemberAvatar member={members.get(1)} style={stylesExtended.squareInnerCenter} />
          </div>
          <MemberAvatar
            member={members.get(2)}
            size={20}
            style={stylesExtended.squareInnerTop}
          />
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
  members: ImmutablePropTypes.list.isRequired,
  style: PropTypes.object,
};

MemberAvatars.contextTypes = {
  styleManager: PropTypes.object.isRequired,
};

export default pure(MemberAvatars);
