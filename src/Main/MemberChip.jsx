import React from 'react';
import pure from 'recompose/pure';
import Immutable from 'immutable';

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

class MemberChip extends React.Component {
  static propTypes = {
    member: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    style: React.PropTypes.object,
  };

  render() {
    const {
      member,
    } = this.props;

    return (
      <span style={Object.assign({}, styles.root, this.props.style)}>
        <MemberAvatar member={member} size={32} style={styles.avatar} />
        <span style={styles.name}>
          {accountUtils.getNameMember(member)}
        </span>
      </span>
    );
  }
}

export default pure(MemberChip);
