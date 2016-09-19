// @flow weak

import React, {PropTypes} from 'react';
import pure from 'recompose/pure';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {createStyleSheet} from 'stylishly/lib/styleSheet';
import {grey400, green300, red300} from 'material-ui-build/src/styles/colors';
import locale from 'locale';
import List from 'modules/components/List';
import MemberAvatar from 'main/member/Avatar';
import accountUtils from 'main/account/utils';

const styleSheet = createStyleSheet('AccountDetailBalanceChart', () => ({
  root: {
    width: '100%',
    display: 'flex',
  },
  right: {
    width: '50%',
    flexShrink: 0,
    position: 'relative',
  },
  rect: {
    position: 'absolute',
    height: 22,
    paddingTop: 4,
    top: 20,
  },
  rectText: {
    top: 0,
    marginTop: 20,
    padding: '4px 6px',
    position: 'absolute',
    wordBreak: 'break-word',
    boxSizing: 'border-box',
    width: '50%',
    textAlign: 'center',
  },
}));

export const AccountDetailBalanceChart = (props, context) => {
  const classes = context.styleManager.render(styleSheet);

  const {
    currency,
    max,
    member,
  } = props;

  const balance = accountUtils.getMemberBalance(member, currency);

  if (!balance) { // If we add new members and a new currency, the balance is not set
    return null;
  }

  let amountValue;
  const value = balance.get('value');

  const VALUE_MAX = 100;
  let left;
  let leftText;
  let width;
  let background;

  if (Math.round(value * VALUE_MAX) === 0) {
    amountValue = 0;
    width = 2;
    background = grey400;
    left = 50;
    leftText = 50;
  } else {
    amountValue = value;
    width = (Math.abs(value) / max) * VALUE_MAX / 2;

    if (width < 2) {
      width = 2;
    }

    if (value > 0) {
      background = green300;
      left = 50;
      leftText = 50;
    } else {
      background = red300;
      left = VALUE_MAX / 2 - width;
      leftText = 0;
    }
  }

  width = Math.round(width);

  const amount = locale.numberFormat(locale.current, {
    style: 'currency',
    currency: currency,
  }).format(amountValue);

  return (
    <div className={classes.root}>
      <List
        left={<MemberAvatar member={member} />}
        style={{
          width: '50%',
        }}
      >
        {accountUtils.getNameMember(member)}
      </List>
      <div className={classes.right}>
        <div
          className={classes.rect}
          style={{
            left: `${left}%`,
            width: `${width}%`,
            background: background,
          }}
        />
        <div
          className={classes.rectText}
          style={{
            left: `${leftText}%`,
          }}
          data-test="AccountDetailBalanceChart"
        >
          {amount}
        </div>
      </div>
    </div>
  );
};

AccountDetailBalanceChart.propTypes = {
  currency: PropTypes.string.isRequired,
  max: PropTypes.number.isRequired,
  member: ImmutablePropTypes.map.isRequired,
};

AccountDetailBalanceChart.contextTypes = {
  styleManager: PropTypes.object.isRequired,
};

export default pure(AccountDetailBalanceChart);
