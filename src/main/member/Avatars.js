import React from 'react';
import Immutable from 'immutable';
import pure from 'recompose/pure';

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
  square: {
    position: 'absolute',
    top: 0,
    overflow: 'hidden',
  },
  squareInner: {
    borderRadius: 0,
    position: 'absolute',
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

class MemberAvatars extends React.Component {
  static propTypes = {
    members: React.PropTypes.instanceOf(Immutable.List).isRequired,
    style: React.PropTypes.object,
  };

  render() {
    const {
      style,
      members,
    } = this.props;

    switch (members.size) {
      case 1:
        return <MemberAvatar style={style} member={members.get(0)} />;

      case 2:
        return <MemberAvatar style={style} member={members.get(1)} />;

      case 3:
        return (
          <div style={Object.assign({}, styles.root, style)}>
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
          <div style={Object.assign({}, styles.root, style)}>
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
  }
}

export default pure(MemberAvatars);
