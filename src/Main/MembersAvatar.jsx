'use strict';

const React = require('react/addons');
const Immutable = require('immutable');
const _ = require('underscore');

const MemberAvatar = require('Main/MemberAvatar');

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
    React.addons.PureRenderMixin,
  ],
  render: function() {
    const style = this.props.style;
    let members = this.props.members;
    members = members.slice(1, 4); // Up to 3 elements, skiping the first one

    switch (members.size) {
      case 0:
        console.warn('members is empty');
        break;

      case 1:
        return <MemberAvatar style={style} member={members.get(0)} />;

      case 2:
        return <div style={_.extend({}, styles.root, style)}>
            <div style={_.extend({}, styles.square, {
              width: 20,
              height: 40,
            })}>
              <MemberAvatar member={members.get(0)} style={_.extend({}, styles.squareInner, {
                left: -10,
              })} />
            </div>
            <div style={_.extend({}, styles.square, {
              left: 21,
              width: 20,
              height: 40,
            })}>
              <MemberAvatar member={members.get(1)} style={_.extend({}, styles.squareInner, {
                left: -10,
              })} />
            </div>
          </div>;

      case 3:
      default:
        return <div style={_.extend({}, styles.root, style)}>
            <div style={_.extend({}, styles.square, {
              width: 20,
              height: 40,
            })}>
              <MemberAvatar member={members.get(0)} style={_.extend({}, styles.squareInner, {
                left: -10,
              })} />
            </div>
            <MemberAvatar member={members.get(1)} style={_.extend({}, styles.square, styles.squareInner, {
              left: 21,
            })} size={20} />
            <MemberAvatar member={members.get(2)} style={_.extend({}, styles.square, styles.squareInner, {
              top: 21,
              left: 21,
            })} size={20} />
          </div>;
    }
  },
});

module.exports = MembersAvatar;
