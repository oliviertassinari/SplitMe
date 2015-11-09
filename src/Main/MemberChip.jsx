'use strict';

const React = require('react');
const PureRenderMixin = require('react-addons-pure-render-mixin');
const Immutable = require('immutable');
const StylePropable = require('material-ui/lib/mixins/style-propable');

const accountUtils = require('Main/Account/utils');
const MemberAvatar = require('Main/MemberAvatar');

const styles = {
  root: {
    display: 'flex',
    padding: 8,
    alignItems: 'center',
  },
  avatar: {
    flexShrink: 0,
  },
  name: {
    paddingLeft: 8,
    fontSize: 13,
  },
};

const MemberChip = React.createClass({
  propTypes: {
    member: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    style: React.PropTypes.object,
  },
  mixins: [
    PureRenderMixin,
    StylePropable,
  ],
  render() {
    const {
      member,
    } = this.props;

    return (
      <span style={this.mergeAndPrefix(styles.root, this.props.style)}>
        <MemberAvatar member={member} size={32} style={styles.avatar} />
        <span style={styles.name}>
          {accountUtils.getNameMember(member)}
        </span>
      </span>
    );
  },
});

module.exports = MemberChip;
