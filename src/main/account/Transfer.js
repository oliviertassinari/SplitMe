import React from 'react';
import pure from 'recompose/pure';

import locale from 'locale';
import MemberChip from 'main/member/Chip';

const styles = {
  root: {
    display: 'flex',
    padding: '14px 0 8px',
  },
  satelite: {
    width: '34%',
  },
  center: {
    textAlign: 'center',
    width: '31%',
    fontSize: 18,
    wordBreak: 'break-word',
  },
  svg: {
    height: 20,
    width: 70,
    marginTop: 2,
  },
};

class AccountTransfer extends React.Component {
  static propTypes = {
    transfer: React.PropTypes.object.isRequired,
  };

  render() {
    const transfer = this.props.transfer;
    const amount = locale.numberFormat(locale.current, {
      style: 'currency',
      currency: transfer.currency,
    }).format(transfer.amount);

    return (
      <div style={styles.root} data-test="AccountTransfer">
        <MemberChip member={transfer.from} style={styles.satelite} />
        <div style={styles.center}>
          <div>{amount}</div>
          <svg style={styles.svg} viewBox="0 0 84 24">
            <path d="m70.4 4c-0.4 0.4-0.4 1.1 0 1.6l5.2 5.2 -70 0c-0.6
              0-1.1 0.5-1.1 1.1 0 0.6 0.5 1.1 1.1 1.1l70 0 -5.2 5.2c-0.4
              0.4-0.4 1.1 0 1.6 0.4 0.4 1.1 0.4 1.6 0l7.1-7.1c0.2-0.2
              0.3-0.5 0.3-0.8s-0.1-0.6-0.3-0.8l-7.1-7.1c-0.4-0.4-1.1-0.4-1.6 0l0 0z"
            />
          </svg>
        </div>
        <MemberChip member={transfer.to} style={styles.satelite} />
      </div>
    );
  }
}

export default pure(AccountTransfer);
