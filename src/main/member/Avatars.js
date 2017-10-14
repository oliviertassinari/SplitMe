import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ImmutablePropTypes from 'react-immutable-proptypes';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import { withStyles } from 'material-ui-next/styles';
import MemberAvatar from 'main/member/Avatar';

const styles = {
  root: {
    borderRadius: '50%',
    height: 40,
    width: 40,
    overflow: 'hidden',
    position: 'relative',
    zIndex: 0,
  },
};

const inlineStyles = {
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

const inlineStylesExtended = {
  squareLeft: Object.assign({}, inlineStyles.square, {
    width: 20,
    height: 40,
  }),
  squareRight: Object.assign({}, inlineStyles.square, {
    left: 21,
    width: 20,
    height: 40,
  }),
  squareInnerCenter: Object.assign({}, inlineStyles.squareInner, {
    left: -10,
  }),
  squareInnerTop: Object.assign({}, inlineStyles.square, inlineStyles.squareInner, {
    left: 21,
  }),
  squareInnerBottom: Object.assign({}, inlineStyles.square, inlineStyles.squareInner, {
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
          <div style={inlineStylesExtended.squareLeft}>
            <MemberAvatar member={members.get(1)} style={inlineStylesExtended.squareInnerCenter} />
          </div>
          <div style={inlineStylesExtended.squareRight}>
            <MemberAvatar member={members.get(2)} style={inlineStylesExtended.squareInnerCenter} />
          </div>
        </div>
      );

    case 4:
    default:
      return (
        <div className={classNames(classes.root, className)}>
          <div style={inlineStylesExtended.squareLeft}>
            <MemberAvatar member={members.get(1)} style={inlineStylesExtended.squareInnerCenter} />
          </div>
          <MemberAvatar
            member={members.get(2)}
            size={20}
            style={inlineStylesExtended.squareInnerTop}
          />
          <MemberAvatar
            member={members.get(3)}
            size={20}
            style={inlineStylesExtended.squareInnerBottom}
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

export default compose(pure, withStyles(styles))(MemberAvatars);
