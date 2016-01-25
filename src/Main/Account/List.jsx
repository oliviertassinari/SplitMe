import React from 'react';
import pure from 'recompose/pure';
import Immutable from 'immutable';
import {createSelector} from 'reselect';
import AppBar from 'material-ui/lib/app-bar';
import Paper from 'material-ui/lib/paper';
import IconButton from 'material-ui/lib/icon-button';
import IconMoreVert from 'material-ui/lib/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import ListItem from 'material-ui/lib/lists/list-item';
import EventListener from 'react-event-listener';
import {connect} from 'react-redux';
import {routeActions} from 'redux-simple-router';
import moment from 'moment';
import DocumentTitle from 'react-document-title';

import API from 'API';
import locale from 'locale';
import polyglot from 'polyglot';
import accountUtils from 'Main/Account/utils';
import CanvasHead from 'Main/Canvas/Head';
import CanvasBody from 'Main/Canvas/Body';
import MembersAvatar from 'Main/MembersAvatar';
import MainActionButton from 'Main/MainActionButton';
import AccountListItemBalance from 'Main/Account/ListItemBalance';
import ListItemBody from 'Main/ListItemBody';
import AccountListEmpty from 'Main/Account/ListEmpty';
import accountActions from 'Main/Account/actions';

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

const AccountList = React.createClass({
  propTypes: {
    accountsSorted: React.PropTypes.instanceOf(Immutable.List).isRequired,
    dispatch: React.PropTypes.func.isRequired,
    isAccountsFetched: React.PropTypes.bool.isRequired,
  },
  componentDidMount() {
    this.props.dispatch(accountActions.fetchList());
  },
  handleBackButton() {
    if (process.env.PLATFORM === 'android') {
      window.navigator.app.exitApp();
    } else if (process.env.NODE_ENV !== 'production') {
      console.info('Trigger exit the app');
    }
  },
  onTouchTapList(account, event) {
    event.preventDefault();

    setTimeout(() => {
      this.props.dispatch(routeActions.push('/account/' +
        API.accountRemovePrefixId(account.get('_id')) +
        '/expenses'));
    }, 0);
  },
  handleTouchTapAddExpense(event) {
    event.preventDefault();

    setTimeout(() => {
      this.props.dispatch(routeActions.push('/expense/add'));
    }, 0);
  },
  handleTouchTapSettings(event) {
    event.preventDefault();

    setTimeout(() => {
      this.props.dispatch(routeActions.push('/settings'));
    }, 0);
  },
  handleTouchTapAddAccount() {
    event.preventDefault();

    setTimeout(() => {
      this.props.dispatch(routeActions.push('/account/add'));
    }, 0);
  },
  render() {
    const {
      accountsSorted,
      isAccountsFetched,
    } = this.props;

    const appBarRight = (
      <IconMenu iconButtonElement={<IconButton><IconMoreVert /></IconButton>}
        className="testAccountListMore"
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
      >
        <MenuItem primaryText={polyglot.t('settings')} onTouchTap={this.handleTouchTapSettings}
          data-test="Settings"
        />
        <MenuItem primaryText={polyglot.t('account_add_new')} onTouchTap={this.handleTouchTapAddAccount}
          data-test="AccountAddNew"
        />
      </IconMenu>
    );

    return (
      <div>
        {(process.env.PLATFORM === 'browser' || process.env.PLATFORM === 'server') &&
          <DocumentTitle title={polyglot.t('my_accounts')} />
        }
        <EventListener elementName="document" onBackButton={this.handleBackButton} />
        <CanvasHead>
          <AppBar title={polyglot.t('my_accounts')}
            iconElementLeft={<div />} data-test="AppBar"
            iconElementRight={appBarRight}
          />
        </CanvasHead>
        <CanvasBody style={styles.content}>
          <Paper rounded={false}>
            {accountsSorted.map((account) => {
              const avatar = <MembersAvatar members={account.get('members')} style={styles.avatar} />;
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
                <ListItem leftAvatar={avatar} data-test="ListItem"
                  onTouchTap={this.onTouchTapList.bind(this, account)} key={account.get('_id')}
                >
                  <ListItemBody title={accountUtils.getNameAccount(account)} right={accountListItemBalance}
                    description={description}
                  />
                </ListItem>
              );
            })}
          </Paper>
          {isAccountsFetched && accountsSorted.size === 0 && <AccountListEmpty />}
        </CanvasBody>
        <MainActionButton onTouchTap={this.handleTouchTapAddExpense} />
      </div>
    );
  },
});

function getAccountsSorted(accounts) {
  // DESC date order
  return accounts.sort((accountA, accountB) => {
    if (accountA.get('dateLatestExpense') < accountB.get('dateLatestExpense')) {
      return 1;
    } else if (accountA.get('dateLatestExpense') === accountB.get('dateLatestExpense')) {
      return accountA.get('dateUpdated') < accountB.get('dateUpdated') ? 1 : -1;
    } else {
      return -1;
    }
  });
}

const accountSortedSelector = createSelector(
  (state) => state.get('accounts'),
  (accounts) => {
    return getAccountsSorted(accounts);
  }
);

function mapStateToProps(state) {
  return {
    accountsSorted: accountSortedSelector(state),
    isAccountsFetched: state.get('isAccountsFetched'),
  };
}

export default connect(mapStateToProps)(pure(AccountList));
