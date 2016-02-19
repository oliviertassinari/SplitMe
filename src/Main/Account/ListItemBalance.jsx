import React from 'react';
import pure from 'recompose/pure';
import Immutable from 'immutable';
import {pink500, green600, grey600} from 'material-ui/src/styles/colors';

import locale from 'locale';
import polyglot from 'polyglot';

const styles = {
  root: {
    textAlign: 'right',
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row-reverse',
    margin: '-4px 0',
    wordBreak: 'break-word',
  },
  group: {
    marginLeft: 8,
  },
  body: {
    lineHeight: '13px',
    fontSize: 13,
  },
  amount: {
    fontSize: 20,
    lineHeight: '28px',
    fontWeight: 500,
    marginLeft: 8,
  },
  negatives: {
    color: pink500,
  },
  positives: {
    color: green600,
  },
  neutrale: {
    color: grey600,
  },
};

class AccountListItemBalance extends React.Component {
  static propTypes = {
    account: React.PropTypes.instanceOf(Immutable.Map).isRequired,
  };

  render() {
    // My balances
    const balances = this.props.account.getIn(['members', 0, 'balances'])
      .filter((balance) => {
        return Math.round(balance.get('value') * 100) !== 0;
      });

    if (balances.size > 0) {
      const positives = [];
      const negatives = [];

      balances.forEach((balance) => {
        const amount = locale.numberFormat(locale.current, {
          style: 'currency',
          currency: balance.get('currency'),
        }).format(Math.abs(balance.get('value')));

        if (balance.get('value') < 0) {
          negatives.push(
            <div key={balance.get('currency')} style={Object.assign({}, styles.negatives, styles.amount)}>
              {amount}
            </div>
          );
        } else { // > 0
          positives.push(
            <div key={balance.get('currency')} style={Object.assign({}, styles.positives, styles.amount)}>
              {amount}
            </div>
          );
        }
      });

      const balancesNode = [];

      if (negatives.length) {
        balancesNode.push(
          <div key="negatives" style={styles.group}>
            <div style={Object.assign({}, styles.negatives, styles.body)}>
              {polyglot.t('you_owe')}
            </div>
            {negatives}
          </div>
        );
      }

      if (positives.length) {
        balancesNode.push(
          <div key="positives" style={styles.group}>
            <div style={Object.assign({}, styles.positives, styles.body)}>
              {polyglot.t('owes_you')}
            </div>
            {positives}
          </div>
        );
      }

      return (
        <div style={styles.root}>
          {balancesNode}
        </div>
      );
    } else {
      return (
        <span style={styles.neutrale}>
          {polyglot.t('settled_up')}
        </span>
      );
    }
  }
}

export default pure(AccountListItemBalance);
