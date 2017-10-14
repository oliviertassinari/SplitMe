import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import ImmutablePropTypes from 'react-immutable-proptypes';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import withHandlers from 'recompose/withHandlers';
import { withStyles } from 'material-ui-next/styles';
import { ListItem } from 'material-ui-next/List';
import polyglot from 'polyglot';
import locale from 'locale';
import ListItemBody from 'modules/components/ListItemBody';
import accountUtils from 'main/account/utils';
import MemberAvatars from 'main/member/Avatars';
import AccountListItemBalance from 'main/account/ListItemBalance';

const styles = {
  avatar: {
    alignSelf: 'flex-start',
    marginRight: 15,
    flexShrink: 0,
  },
};

const AccountListItem = props => {
  const { account, classes, onClick } = props;

  const accountListItemBalance = <AccountListItemBalance account={account} />;

  let description;

  if (account.get('expenses').size > 0) {
    const date = locale
      .dateTimeFormat(locale.current, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
      .format(moment(account.get('dateLatestExpense'), 'YYYY-MM-DD')); // Sep 13, 2015
    description = polyglot.t('expense_latest', { date });
  } else {
    description = polyglot.t('expense_no');
  }

  return (
    <ListItem button onClick={onClick} data-test="ListItem">
      <MemberAvatars members={account.get('members')} className={classes.avatar} />
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
  classes: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default compose(
  pure,
  withStyles(styles),
  withHandlers({
    onClick: props => event => {
      props.onTouchTap(event, props.account);
    },
  }),
)(AccountListItem);
