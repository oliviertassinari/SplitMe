// @flow weak

import React, { PropTypes } from 'react';
import pure from 'recompose/pure';
import moment from 'moment';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ListItem from 'material-ui-build/src/List/ListItem';
import polyglot from 'polyglot';
import locale from 'locale';
import ListItemBody from 'modules/components/ListItemBody';
import accountUtils from 'main/account/utils';
import MemberAvatar from 'main/member/Avatar';

const styles = {
  // Fix for displaying element at the right of the ListItem
  avatar: {
    top: 16,
  },
  // End of fix
};

const ExpenseListItem = (props) => {
  const {
    account,
    expense,
    onTouchTap,
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
  const avatar = <MemberAvatar member={paidBy} style={styles.avatar} />;

  return (
    <ListItem
      leftAvatar={avatar}
      onTouchTap={onTouchTap.bind(this, expense)}
      data-test="ListItem"
    >
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
  expense: ImmutablePropTypes.map.isRequired,
  onTouchTap: PropTypes.func.isRequired,
};

export default pure(ExpenseListItem);
