// @flow weak

import React, {PropTypes, Component} from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {createSelector} from 'reselect';
import {push} from 'react-router-redux';
import moment from 'moment';
import {connect} from 'react-redux';
import EventListener from 'react-event-listener';
import DocumentTitle from 'react-document-title';
import Paper from 'material-ui-build/src/Paper';
import IconButton from 'material-ui-build/src/IconButton';
import IconMoreVert from 'material-ui-build/src/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui-build/src/IconMenu/IconMenu';
import MenuItem from 'material-ui-build/src/MenuItem';
import ListItem from 'material-ui-build/src/List/ListItem';
import API from 'API';
import locale from 'locale';
import polyglot from 'polyglot';
import ViewContainer from 'modules/components/ViewContainer';
import ScrollView from 'modules/components/ScrollView';
import LayoutAppBar from 'modules/components/LayoutAppBar';
import LayoutBody from 'modules/components/LayoutBody';
import accountUtils from 'main/account/utils';
import MemberAvatars from 'main/member/Avatars';
import MainActionButton from 'main/MainActionButton';
import AccountListItemBalance from 'main/account/ListItemBalance';
import ListItemBody from 'modules/components/ListItemBody';
import TextIconError from 'modules/components/TextIconError';
import accountActions from 'main/account/actions';
import AccountListEmpty from './ListEmpty';

const styles = {
  content: {
    paddingBottom: 60,
  },
  // Fix for displaying element at the right of the ListItem
  avatar: {
    top: 16,
  },
  // End of fix
};

export class AccountList extends Component {
  static propTypes = {
    accounts: ImmutablePropTypes.shape({
      payload: ImmutablePropTypes.list.isRequired,
      status: PropTypes.string.isRequired,
    }),
    dispatch: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.dispatch(accountActions.fetchList());
  }

  onTouchTapList = (account, event) => {
    event.preventDefault();

    setTimeout(() => {
      this.props.dispatch(push(`/account/${
        API.accountRemovePrefixId(account.get('_id'))
        }/expenses`));
    }, 0);
  };

  handleBackButton = () => {
    // Exit the app
    if (process.env.PLATFORM === 'android' || process.env.PLATFORM === 'ios') {
      window.navigator.app.exitApp();
    } else if (process.env.NODE_ENV !== 'production') {
      console.info('Trigger exit the app'); // eslint-disable-line no-console
    }
  };

  handleTouchTapAddExpense = (event) => {
    event.preventDefault();

    setTimeout(() => {
      this.props.dispatch(push('/expense/add'));
    }, 0);
  };

  handleTouchTapSettings = (event) => {
    event.preventDefault();

    setTimeout(() => {
      this.props.dispatch(push('/settings'));
    }, 0);
  };

  handleTouchTapAddAccount = (event) => {
    event.preventDefault();

    setTimeout(() => {
      this.props.dispatch(push('/account/add'));
    }, 0);
  };

  render() {
    const {
      accounts,
    } = this.props;

    const appBarRight = (
      <IconMenu
        iconButtonElement={<IconButton><IconMoreVert /></IconButton>}
        className="testAccountListMore"
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
      >
        <MenuItem
          primaryText={polyglot.t('account_add_new')}
          onTouchTap={this.handleTouchTapAddAccount}
          data-test="AccountAddNew"
        />
        <MenuItem
          primaryText={polyglot.t('settings')}
          onTouchTap={this.handleTouchTapSettings}
          data-test="Settings"
        />
      </IconMenu>
    );

    return (
      <ViewContainer>
        {(process.env.PLATFORM === 'browser' || process.env.PLATFORM === 'server') &&
          <DocumentTitle title={polyglot.t('my_accounts')} />
        }
        <EventListener target="document" onBackButton={this.handleBackButton} />
        <LayoutAppBar
          title={polyglot.t('my_accounts')}
          showMenuIconButton={false}
          iconElementRight={appBarRight}
        />
        <ScrollView>
          <LayoutBody style={styles.content}>
            <Paper rounded={false}>
              {accounts.get('payload').map((account) => {
                const avatar = <MemberAvatars members={account.get('members')} style={styles.avatar} />;
                const accountListItemBalance = <AccountListItemBalance account={account} />;

                let description;

                if (account.get('expenses').size > 0) {
                  const date = locale.dateTimeFormat(locale.current, {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  }).format(moment(account.get('dateLatestExpense'), 'YYYY-MM-DD')); // Sep 13, 2015
                  description = polyglot.t('expense_latest', {date: date});
                } else {
                  description = polyglot.t('expense_no');
                }

                return (
                  <ListItem
                    key={account.get('_id')}
                    leftAvatar={avatar}
                    onTouchTap={this.onTouchTapList.bind(this, account)}
                    data-test="ListItem"
                  >
                    <ListItemBody
                      title={accountUtils.getNameAccount(account)}
                      right={accountListItemBalance}
                      description={description}
                    />
                  </ListItem>
                );
              })}
            </Paper>
            {accounts.get('status') === 'success' && accounts.get('payload').size === 0 && <AccountListEmpty />}
            {accounts.get('status') === 'error' && <TextIconError text={polyglot.t('pouchdb_error')} />}
          </LayoutBody>
        </ScrollView>
        <MainActionButton onTouchTap={this.handleTouchTapAddExpense} />
      </ViewContainer>
    );
  }
}

function getAccountsSorted(accounts) {
  // DESC date order
  return accounts.sort((accountA, accountB) => {
    // Use 'a' > [0-9] to prioritize account without expenses.
    const dateLatestExpenseA = accountA.get('dateLatestExpense') || 'a';
    const dateLatestExpenseB = accountB.get('dateLatestExpense') || 'a';

    if (dateLatestExpenseA < dateLatestExpenseB) {
      return 1;
    } else if (dateLatestExpenseA === dateLatestExpenseB) {
      return accountA.get('dateUpdated') < accountB.get('dateUpdated') ? 1 : -1;
    } else {
      return -1;
    }
  });
}

const accountSortedSelector = createSelector(
  (state) => state.getIn(['account', 'accounts']),
  (accounts) => {
    return accounts.set('payload', getAccountsSorted(accounts.get('payload')));
  }
);

export default compose(
  pure,
  connect((state) => {
    return {
      accounts: accountSortedSelector(state),
    };
  }),
)(AccountList);
