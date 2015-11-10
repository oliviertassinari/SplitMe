import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Immutable from 'immutable';
import StylePropable from 'material-ui/lib/mixins/style-propable';

import accountUtils from 'Main/Account/utils';
import MemberAvatar from 'Main/MemberAvatar';

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

export default MemberChip;
