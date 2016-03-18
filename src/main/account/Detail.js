import React from 'react';
import pure from 'recompose/pure';
import {createSelector} from 'reselect';
import Immutable from 'immutable';
import AppBar from 'material-ui/src/app-bar';
import Tabs from 'material-ui/src/tabs/tabs';
import Tab from 'material-ui/src/tabs/tab';
import IconButton from 'material-ui/src/icon-button';
import IconClose from 'material-ui/src/svg-icons/navigation/close';
import IconMoreVert from 'material-ui/src/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/src/menus/icon-menu';
import MenuItem from 'material-ui/src/menus/menu-item';
import EventListener from 'react-event-listener';
import {connect} from 'react-redux';
import {push, replace} from 'react-router-redux';
import DocumentTitle from 'react-document-title';

import polyglot from 'polyglot';
import accountUtils from 'main/account/utils';
import CanvasHead from 'main/canvas/Head';
import CanvasBody from 'main/canvas/Body';
import ExpenseList from 'main/expense/List';
import MainActionButton from 'main/MainActionButton';
import AccountBalance from 'main/account/Balance';
import AccountDebts from 'main/account/Debts';
import accountActions from 'main/account/actions';
import screenActions from 'main/screen/actions';
import modalActions from 'main/modal/actions';
import SwipeableViews from 'react-swipeable-views';

const styles = {
  appBar: {
    flexWrap: 'wrap',
  },
  tabs: {
    width: '100%',
  },
  swipeable: {
    minHeight: '85vh',
    maxHeight: '100vh',
  },
  content: {
    paddingTop: 104,
    paddingBottom: 60,
  },
};

const pages = [
  'account/:id/expenses',
  'account/:id/balance',
  'account/:id/debt',
];

class AccountDetail extends React.Component {
  static propTypes = {
    account: React.PropTypes.instanceOf(Immutable.Map),
    dispatch: React.PropTypes.func.isRequired,
    route: React.PropTypes.object.isRequired,
    routeParams: React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
    }).isRequired,
  };

  componentDidMount = () => {
    this.props.dispatch(accountActions.fetchDetail(this.props.routeParams.id));
  };

  handleBackButton = () => {
    this.props.dispatch(screenActions.navigateBack(push('/accounts')));
  };

  handleTouchTapAddExpense = (event) => {
    event.preventDefault();
    const props = this.props;

    setTimeout(() => {
      props.dispatch(push(`/account/${this.props.routeParams.id}/expense/add`));
    }, 0);
  };

  handleTouchTapSettings = (event) => {
    event.preventDefault();

    setTimeout(() => {
      this.props.dispatch(push(`/account/${this.props.routeParams.id}/edit`));
    }, 0);
  };

  handleTouchTapDelete = (event) => {
    event.preventDefault();

    setTimeout(() => {
      this.props.dispatch(modalActions.show(
        [
          {
            textKey: 'cancel',
          },
          {
            textKey: 'delete',
            dispatchAction: () => {
              return accountActions.tapDelete(this.props.routeParams.id);
            },
          },
        ],
        'account_delete_description',
        'account_delete_title'
      ));
    }, 0);
  };

  handleTouchTapClose = (event) => {
    event.preventDefault();

    setTimeout(() => {
      this.props.dispatch(push('/accounts'));
    }, 0);
  };

  handleChangeIndex = (index) => {
    this.props.dispatch(
      replace(`/${pages[index].replace(':id', this.props.routeParams.id)}`)
    );
  };

  render() {
    const {
      account,
      route,
    } = this.props;

    const index = pages.indexOf(route.path);

    const appBarLeft = (
      <IconButton onTouchTap={this.handleTouchTapClose}>
        <IconClose />
      </IconButton>
    );

    const appBarRight = (
      <IconMenu
        iconButtonElement={<IconButton><IconMoreVert /></IconButton>}
        className="testAccountDetailMore"
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
      >
        <MenuItem
          primaryText={polyglot.t('settings')}
          onTouchTap={this.handleTouchTapSettings}
          data-test="AccountDetailSettings"
        />
        <MenuItem
          primaryText={polyglot.t('delete')}
          onTouchTap={this.handleTouchTapDelete}
          data-test="AccountDetailDelete"
        />
      </IconMenu>
    );

    const title = accountUtils.getNameAccount(account);

    return (
      <div>
        {(process.env.PLATFORM === 'browser' || process.env.PLATFORM === 'server') &&
          <DocumentTitle title={title} />
        }
        <EventListener elementName="document" onBackButton={this.handleBackButton} />
        <CanvasHead>
          <AppBar
            title={title}
            style={styles.appBar}
            data-test="AppBar"
            iconElementLeft={appBarLeft} iconElementRight={appBarRight}
          >
            <Tabs onChange={this.handleChangeIndex} style={styles.tabs} value={index}>
              <Tab
                label={polyglot.t('expenses')}
                value={0}
                data-test="AccountDetailExpenses"
              />
              <Tab
                label={polyglot.t('balance')}
                value={1}
                data-test="AccountDetailBalance"
              />
              <Tab
                label={polyglot.t('debts')}
                value={2}
                data-test="AccountDetailDebts"
              />
            </Tabs>
          </AppBar>
        </CanvasHead>
          {account &&
            <SwipeableViews containerStyle={styles.swipeable} index={index} onChangeIndex={this.handleChangeIndex}>
              <CanvasBody style={styles.content}>
                <ExpenseList account={account} />
              </CanvasBody>
              <CanvasBody style={styles.content}>
                <AccountBalance members={account.get('members')} />
              </CanvasBody>
              <CanvasBody style={styles.content}>
                <AccountDebts members={account.get('members')} />
              </CanvasBody>
            </SwipeableViews>
          }
        <MainActionButton onTouchTap={this.handleTouchTapAddExpense} />
      </div>
    );
  }
}

const accountCurrentSelector = createSelector(
  (data) => data.state.get('accounts'),
  (data) => data.props.routeParams.id,
  (accounts, accountId) => {
    const accountEntry = accountUtils.findEntry(accounts, accountId);

    if (accountEntry) {
      return accountEntry[1];
    } else {
      return null;
    }
  }
);

function mapStateToProps(state, ownProps) {
  return {
    account: accountCurrentSelector({
      state: state,
      props: ownProps,
    }),
  };
}

export default pure(connect(mapStateToProps)(AccountDetail));
