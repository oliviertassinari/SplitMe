// @flow weak

import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import withHandlers from 'recompose/withHandlers';
import moment from 'moment';
import { createStyleSheet } from 'jss-theme-reactor';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { ListItem } from 'material-ui-build-next/src/List';
import polyglot from 'polyglot';
import locale from 'locale';
import withStyles from 'material-ui-build-next/src/styles/withStyles';
import ListItemBody from 'modules/components/ListItemBody';
import accountUtils from 'main/account/utils';
import MemberAvatar from 'main/member/Avatar';

const styleSheet = createStyleSheet('ExpenseListItem', () => ({
  avatar: {
    alignSelf: 'flex-start',
    marginRight: 15,
    flexShrink: 0,
  },
}));

const ExpenseListItem = (props) => {
  const {
    account,
    classes,
    expense,
    onClick,
  } = props;

  const amount = locale.numberFormat(locale.current, {
    style: 'currency',
    currency: expense.get('currency'),
  }).format(expense.get('amount'));
  const date = locale.dateTimeFormat(locale.current, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(moment(expense.get('date'), 'YYYY-MM-DD')); // Sep 13, 2015
  const paidBy = accountUtils.getMemberEntry(account, expense.get('paidByContactId'))[1];

  return (
    <ListItem
      button
      onClick={onClick}
      data-test="ListItem"
    >
      <MemberAvatar member={paidBy} className={classes.avatar} />
      <ListItemBody
        title={expense.get('description')} right={amount}
        description={
          `${polyglot.t('paid_by_name', {
            name: accountUtils.getNameMember(paidBy),
          })}, ${date}`
        }
      />
    </ListItem>
  );
};

ExpenseListItem.propTypes = {
  account: ImmutablePropTypes.map.isRequired,
  classes: PropTypes.object.isRequired,
  expense: ImmutablePropTypes.map.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default compose(
  pure,
  withStyles(styleSheet),
  withHandlers({
    onClick: (props) => (
      (event) => {
        props.onTouchTap(event, props.expense);
      }
    ),
  }),
)(ExpenseListItem);
