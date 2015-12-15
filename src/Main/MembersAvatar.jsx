import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Immutable from 'immutable';

import MemberAvatar from 'Main/MemberAvatar';

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
    borderRadius: '0',
    position: 'absolute',
  },
};

const MembersAvatar = React.createClass({
  propTypes: {
    members: React.PropTypes.instanceOf(Immutable.List).isRequired,
    style: React.PropTypes.object,
  },
  mixins: [
    PureRenderMixin,
  ],
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
            <div style={Object.assign({}, styles.square, {
              width: 20,
              height: 40,
            })}>
              <MemberAvatar member={members.get(1)} style={Object.assign({}, styles.squareInner, {
                left: -10,
              })} />
            </div>
            <div style={Object.assign({}, styles.square, {
              left: 21,
              width: 20,
              height: 40,
            })}>
              <MemberAvatar member={members.get(2)} style={Object.assign({}, styles.squareInner, {
                left: -10,
              })} />
            </div>
          </div>
        );

      case 4:
      default:
        return (
          <div style={Object.assign({}, styles.root, style)}>
            <div style={Object.assign({}, styles.square, {
              width: 20,
              height: 40,
            })}>
              <MemberAvatar member={members.get(1)} style={Object.assign({}, styles.squareInner, {
                left: -10,
              })} />
            </div>
            <MemberAvatar member={members.get(2)} style={Object.assign({}, styles.square, styles.squareInner, {
              left: 21,
            })} size={20} />
            <MemberAvatar member={members.get(3)} style={Object.assign({}, styles.square, styles.squareInner, {
              top: 21,
              left: 21,
            })} size={20} />
          </div>
        );
    }
  },
});

export default MembersAvatar;
