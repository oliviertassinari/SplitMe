import React, {PropTypes, Component} from 'react';
import pure from 'recompose/pure';
import {createSelector} from 'reselect';
import ImmutablePropTypes from 'react-immutable-proptypes';
import AppBar from 'material-ui-build/src/AppBar';
import Tabs from 'material-ui-build/src/Tabs/Tabs';
import Tab from 'material-ui-build/src/Tabs/Tab';
import IconButton from 'material-ui-build/src/IconButton';
import IconClose from 'material-ui-build/src/svg-icons/navigation/close';
import IconMoreVert from 'material-ui-build/src/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui-build/src/IconMenu';
import MenuItem from 'material-ui-build/src/MenuItem';
import {connect} from 'react-redux';
import {push, replace} from 'react-router-redux';
import DocumentTitle from 'react-document-title';

import polyglot from 'polyglot';
import routerActions from 'main/routerActions';
import accountUtils from 'main/account/utils';
import CanvasHead from 'main/canvas/Head';
import CanvasBody from 'main/canvas/Body';
import ExpenseList from 'main/expense/List';
import TextIcon from 'main/TextIcon';
import MainActionButton from 'main/MainActionButton';
import AccountDetailBalance from 'main/account/detail/Balance';
import AccountDetailDebts from 'main/account/detail/Debts';
import accountDetailActions from 'main/account/detail/actions';
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

class AccountDetail extends Component {
  static propTypes = {
    account: ImmutablePropTypes.map,
    dispatch: PropTypes.func.isRequired,
    fetched: PropTypes.bool.isRequired,
    route: PropTypes.object.isRequired,
    routeParams: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  };

  componentDidMount() {
    this.props.dispatch(accountDetailActions.fetch(this.props.routeParams.id));
  }

  componentWillUnmount() {
    this.props.dispatch(accountDetailActions.unmount());
  }

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
            textKey: polyglot.t('cancel'),
          },
          {
            textKey: polyglot.t('delete'),
            dispatchAction: () => {
              return accountDetailActions.tapDelete(this.props.routeParams.id);
            },
          },
        ],
        polyglot.t('account_delete_description'),
        polyglot.t('account_delete_title')
      ));
    }, 0);
  };

  handleTouchTapClose = (event) => {
    event.preventDefault();

    setTimeout(() => {
      this.props.dispatch(routerActions.goBack('/accounts'));
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
      fetched,
      route,
    } = this.props;

    const index = pages.indexOf(route.path);

    const appBarLeft = (
      <IconButton onTouchTap={this.handleTouchTapClose}>
        <IconClose />
      </IconButton>
    );

    const title = accountUtils.getNameAccount(account);

    let body;
    let mainActionButton;
    let appBarRight;

    if (fetched) {
      if (account) {
        appBarRight = (
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

        body = (
          <SwipeableViews
            containerStyle={styles.swipeable}
            index={index}
            onChangeIndex={this.handleChangeIndex}
          >
            <CanvasBody style={styles.content}>
              <ExpenseList account={account} />
            </CanvasBody>
            <CanvasBody style={styles.content}>
              <AccountDetailBalance members={account.get('members')} />
            </CanvasBody>
            <CanvasBody style={styles.content}>
              <AccountDetailDebts members={account.get('members')} />
            </CanvasBody>
          </SwipeableViews>
        );

        mainActionButton = <MainActionButton onTouchTap={this.handleTouchTapAddExpense} />;
      } else {
        body = <TextIcon text={polyglot.t('account_not_found')} />;
      }
    }

    return (
      <div>
        {(process.env.PLATFORM === 'browser' || process.env.PLATFORM === 'server') &&
          <DocumentTitle title={title} />
        }
        <CanvasHead>
          <AppBar
            title={title}
            style={styles.appBar}
            iconElementLeft={appBarLeft}
            iconElementRight={appBarRight}
            data-test="AppBar"
          >
            <Tabs onChange={this.handleChangeIndex} style={styles.tabs} value={index}>
              <Tab
                value={0}
                label={polyglot.t('expenses')}
                data-test="AccountDetailTabExpenses"
              />
              <Tab
                value={1}
                label={polyglot.t('balance')}
                data-test="AccountDetailTabBalance"
              />
              <Tab
                value={2}
                label={polyglot.t('debts')}
                data-test="AccountDetailTabDebts"
              />
            </Tabs>
          </AppBar>
        </CanvasHead>
        {body}
        {mainActionButton}
      </div>
    );
  }
}

const accountCurrentSelector = createSelector(
  (data) => data.state.getIn(['account', 'accounts']),
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
    fetched: state.getIn(['accountDetail', 'fetched']),
  };
}

export default pure(connect(mapStateToProps)(AccountDetail));
