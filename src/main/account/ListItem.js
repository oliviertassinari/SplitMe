// @flow weak

import React, { PropTypes } from 'react';
import moment from 'moment';
import ImmutablePropTypes from 'react-immutable-proptypes';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import withHandlers from 'recompose/withHandlers';
import ListItem from 'material-ui-build/src/List/ListItem';
import polyglot from 'polyglot';
import locale from 'locale';
import ListItemBody from 'modules/components/ListItemBody';
import accountUtils from 'main/account/utils';
import MemberAvatars from 'main/member/Avatars';
import AccountListItemBalance from 'main/account/ListItemBalance';

const styles = {
  // Fix for displaying element at the right of the ListItem
  avatar: {
    top: 16,
  },
  // End of fix
};

const AccountListItem = (props) => {
  const {
    account,
    onTouchTap,
  } = props;

  const accountListItemBalance = <AccountListItemBalance account={account} />;

  let description;

  if (account.get('expenses').size > 0) {
    const date = locale.dateTimeFormat(locale.current, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(moment(account.get('dateLatestExpense'), 'YYYY-MM-DD')); // Sep 13, 2015
    description = polyglot.t('expense_latest', { date });
  } else {
    description = polyglot.t('expense_no');
  }

  return (
    <ListItem
      leftAvatar={
        <MemberAvatars members={account.get('members')} style={styles.avatar} />
      }
      onTouchTap={onTouchTap}
      data-test="ListItem"
    >
      <ListItemBody
        title={accountUtils.getNameAccount(account)}
        right={accountListItemBalance}
        description={description}
      />
    </ListItem>
  );
};

AccountListItem.propTypes = {
  account: ImmutablePropTypes.map.isRequired,
  onTouchTap: PropTypes.func.isRequired,
};

export default compose(
  pure,
  withHandlers({
    onTouchTap: (props) => (
      (event) => {
        props.onTouchTap(event, props.account);
      }
    ),
  }),
)(AccountListItem);
