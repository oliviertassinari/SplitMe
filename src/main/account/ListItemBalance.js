
import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import classNames from 'classnames';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { createStyleSheet } from 'jss-theme-reactor';
import { pink, green, grey } from 'material-ui-build-next/src/styles/colors';
import withStyles from 'material-ui-build-next/src/styles/withStyles';
import locale from 'locale';
import polyglot from 'polyglot';

const styleSheet = createStyleSheet('AccountListItemBalance', () => ({
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
    color: pink[500],
  },
  positives: {
    color: green[600],
  },
  neutrale: {
    color: grey[600],
  },
}));

const AccountListItemBalance = (props) => {
  const classes = props.classes;

  // My balances
  const balances = props.account
    .getIn(['members', 0, 'balances'])
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
          <div
            key={balance.get('currency')}
            className={classNames(classes.negatives, classes.amount)}
          >
            {amount}
          </div>,
        );
      } else { // > 0
        positives.push(
          <div
            key={balance.get('currency')}
            className={classNames(classes.positives, classes.amount)}
          >
            {amount}
          </div>,
        );
      }
    });

    const balancesNode = [];

    if (negatives.length) {
      balancesNode.push(
        <div key="negatives" className={classes.group}>
          <div className={classNames(classes.negatives, classes.body)}>
            {polyglot.t('you_owe')}
          </div>
          {negatives}
        </div>,
      );
    }

    if (positives.length) {
      balancesNode.push(
        <div key="positives" className={classes.group}>
          <div className={classNames(classes.positives, classes.body)}>
            {polyglot.t('owes_you')}
          </div>
          {positives}
        </div>,
      );
    }

    return (
      <div className={classes.root}>
        {balancesNode}
      </div>
    );
  }

  return (
    <span className={classes.neutrale}>
      {polyglot.t('settled_up')}
    </span>
  );
};

AccountListItemBalance.propTypes = {
  account: ImmutablePropTypes.map.isRequired,
  classes: PropTypes.object.isRequired,
};

export default compose(
  pure,
  withStyles(styleSheet),
)(AccountListItemBalance);
