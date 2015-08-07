'use strict';

var React = require('react/addons');
var Immutable = require('immutable');
var _ = require('underscore');

var MemberAvatar = require('Main/MemberAvatar');

var styles = {
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
    boxShadow: 'none',
  },
};

var MembersAvatar = React.createClass({
  propTypes: {
    members: React.PropTypes.instanceOf(Immutable.List).isRequired,
  },
  mixins: [
    React.addons.PureRenderMixin,
  ],
  render: function() {
    var props = this.props;
    var members = props.members.slice(1, 4); // Up to 3 elements, skiping the first one

    switch (members.size) {
      case 0:
        console.warn('members is empty');
        break;

      case 1:
        return <MemberAvatar member={members.get(0)} />;

      case 2:
        return <div style={styles.root}>
            <div style={_.extend({}, styles.square, {
                left: -20,
              })}>
              <MemberAvatar member={members.get(0)} style={_.extend({}, styles.squareInner, {
                left: 10,
              })} />
            </div>
            <div style={_.extend({}, styles.square, {
                left: 21,
              })}>
              <MemberAvatar member={members.get(1)} style={_.extend({}, styles.squareInner, {
                left: -10,
              })} />
            </div>
          </div>;

      case 3:
      default:
        return <div style={styles.root}>
            <div style={_.extend({}, styles.square, {
                left: -20,
              })}>
              <MemberAvatar member={members.get(0)} style={_.extend({}, styles.squareInner, {
                left: 10,
              })} />
            </div>
            <MemberAvatar member={members.get(1)} style={_.extend({}, styles.square, styles.squareInner, {
              left: 21,
            })} size={20} />
            <MemberAvatar member={members.get(2)} style={_.extend({}, styles.square, styles.squareInner, {
              left: 21,
              top: 21,
            })} size={20} />
          </div>;
    }
  },
});

module.exports = MembersAvatar;
