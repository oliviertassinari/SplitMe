import React, {PropTypes, Component} from 'react';
import pure from 'recompose/pure';
import Immutable from 'immutable';

import MemberAvatar from 'main/member/Avatar';
import accountUtils from 'main/account/utils';

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

class MemberChip extends Component {
  static propTypes = {
    member: PropTypes.instanceOf(Immutable.Map).isRequired,
    style: PropTypes.object,
  };

  render() {
    const {
      member,
      style,
    } = this.props;

    return (
      <span style={Object.assign({}, styles.root, style)}>
        <MemberAvatar member={member} size={32} style={styles.avatar} />
        <span style={styles.name}>
          {accountUtils.getNameMember(member)}
        </span>
      </span>
    );
  }
}

export default pure(MemberChip);
