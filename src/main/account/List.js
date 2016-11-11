// @flow weak

import React, { PropTypes, Component } from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { createSelector } from 'reselect';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import EventListener from 'react-event-listener';
import DocumentTitle from 'react-document-title';
import Paper from 'material-ui-build-next/src/Paper';
import IconButton from 'material-ui-build/src/IconButton';
import IconMoreVert from 'material-ui-build/src/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui-build/src/IconMenu/IconMenu';
import MenuItem from 'material-ui-build/src/MenuItem';
import API from 'API';
import polyglot from 'polyglot';
import ViewContainer from 'modules/components/ViewContainer';
import ScrollView from 'modules/components/ScrollView';
import LayoutAppBar from 'modules/components/LayoutAppBar';
import LayoutBody from 'modules/components/LayoutBody';
import MainActionButton from 'main/MainActionButton';
import TextIconError from 'modules/components/TextIconError';
import accountActions from 'main/account/actions';
import AccountListEmpty from './ListEmpty';
import AccountListItem from './ListItem';

const styles = {
  content: {
    paddingBottom: 60,
  },
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

  handleTouchTapItem = (event, account) => {
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
        targetOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
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
        {(process.env.PLATFORM === 'browser' || process.env.PLATFORM === 'server') && (
          <DocumentTitle title={polyglot.t('my_accounts')} />
        )}
        <EventListener target="document" onBackButton={this.handleBackButton} />
        <LayoutAppBar
          title={polyglot.t('my_accounts')}
          showMenuIconButton={false}
          iconElementRight={appBarRight}
        />
        <ScrollView>
          <LayoutBody style={styles.content}>
            <Paper rounded={false}>
              {accounts.get('payload').map((account) => (
                <AccountListItem
                  key={account.get('_id')}
                  account={account}
                  onTouchTap={this.handleTouchTapItem}
                />
              ))}
            </Paper>
            {accounts.get('status') === 'success' && accounts.get('payload').size === 0 &&
              <AccountListEmpty />}
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
    }

    return -1;
  });
}

const accountSortedSelector = createSelector(
  (state) => state.getIn(['account', 'accounts']),
  (accounts) => {
    return accounts.set('payload', getAccountsSorted(accounts.get('payload')));
  },
);

export default compose(
  pure,
  connect((state) => {
    return {
      accounts: accountSortedSelector(state),
    };
  }),
)(AccountList);
