
import React, { PropTypes, Component } from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import { createSelector } from 'reselect';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Tabs from 'material-ui-build/src/Tabs/Tabs';
import Tab from 'material-ui-build/src/Tabs/Tab';
import IconButton from 'material-ui-build/src/IconButton';
import IconClose from 'material-ui-build/src/svg-icons/navigation/close';
import IconMoreVert from 'material-ui-build/src/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui-build/src/IconMenu/IconMenu';
import MenuItem from 'material-ui-build/src/MenuItem';
import { connect } from 'react-redux';
import { push, replace } from 'react-router-redux';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import DocumentTitle from 'react-document-title';
import SwipeableViews from 'react-swipeable-views';
import polyglot from 'polyglot';
import routerActions from 'main/routerActions';
import accountUtils from 'main/account/utils';
import ViewContainer from 'modules/components/ViewContainer';
import LayoutAppBar from 'modules/components/LayoutAppBar';
import LayoutBody from 'modules/components/LayoutBody';
import TextIconError from 'modules/components/TextIconError';
import ExpenseList from 'main/expense/List';
import MainActionButton from 'main/MainActionButton';
import AccountDetailBalance from 'main/account/detail/Balance';
import AccountDetailDebts from 'main/account/detail/Debts';
import accountDetailActions from 'main/account/detail/actions';
import screenActions from 'main/screen/actions';
import modalActions from 'main/modal/actions';
import actionTypes from 'redux/actionTypes';
import AccountDetailDeleteHandler from './DetailDeleteHandler';

const styles = {
  layoutAppBar: {
    flexWrap: 'wrap',
  },
  tabs: {
    width: '100%',
  },
  autoSizerContainer: {
    flex: '1 1 auto',
  },
  layoutBody: {
    marginBottom: 60,
  },
};

const pages = [
  ':id/expenses',
  ':id/balance',
  ':id/debt',
];

class AccountDetail extends Component {
  static propTypes = {
    account: ImmutablePropTypes.map,
    dialog: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    fetched: PropTypes.bool.isRequired,
    route: PropTypes.object.isRequired,
    routeParams: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  componentWillMount() {
    this.context.router.setRouteLeaveHook(this.props.route, () => {
      if (this.props.dialog !== '') {
        setTimeout(() => {
          this.props.dispatch(screenActions.dismissDialog());
        }, 0);

        return false;
      }

      return true;
    });
  }

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

    const {
      dispatch,
    } = this.props;

    setTimeout(() => {
      dispatch(modalActions.show({
        actionNames: [
          {
            label: polyglot.t('cancel'),
          },
          {
            label: polyglot.t('delete'),
            onTouchTap: () => {
              dispatch({
                type: actionTypes.ACCOUNT_DETAIL_TAP_DELETE,
              });
            },
          },
        ],
        description: polyglot.t('account_delete_description'),
        title: polyglot.t('account_delete_title'),
      }));
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
      replace(`/account/${pages[index].replace(':id', this.props.routeParams.id)}`),
    );
  };

  render() {
    const {
      account,
      fetched,
      route,
      routeParams,
    } = this.props;

    const index = pages.indexOf(route.path);

    const appBarLeft = (
      <IconButton onTouchTap={this.handleTouchTapClose}>
        <IconClose />
      </IconButton>
    );

    const title = accountUtils.getNameAccount(account);

    let body;
    let mainActionButton = <MainActionButton onTouchTap={this.handleTouchTapAddExpense} />;
    let appBarRight;

    if (fetched) {
      if (account) {
        appBarRight = (
          <IconMenu
            iconButtonElement={<IconButton><IconMoreVert /></IconButton>}
            className="testAccountDetailMore"
            targetOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
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
          <div style={styles.autoSizerContainer}>
            <AutoSizer disableWidth>
              {({ height }) => {
                const style = { height };

                return (
                  <SwipeableViews
                    slideStyle={style}
                    index={index}
                    onChangeIndex={this.handleChangeIndex}
                  >
                    <ExpenseList account={account} layoutBodyStyle={styles.layoutBody} />
                    <AccountDetailBalance style={styles.layoutBody} members={account.get('members')} />
                    <AccountDetailDebts style={styles.layoutBody} members={account.get('members')} />
                  </SwipeableViews>
                );
              }}
            </AutoSizer>
          </div>
        );
      } else {
        body = (
          <LayoutBody>
            <TextIconError text={polyglot.t('account_not_found')} />
          </LayoutBody>
        );
        mainActionButton = null;
      }
    }

    return (
      <ViewContainer>
        {(process.env.PLATFORM === 'browser' || process.env.PLATFORM === 'server') && (
          <DocumentTitle title={title} />
        )}
        <LayoutAppBar
          title={title}
          style={styles.layoutAppBar}
          iconElementLeft={appBarLeft}
          iconElementRight={appBarRight}
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
        </LayoutAppBar>
        {body}
        {mainActionButton}
        <AccountDetailDeleteHandler accountId={routeParams.id} />
      </ViewContainer>
    );
  }
}

const accountCurrentSelector = createSelector(
  (data) => data.state.getIn(['account', 'accounts', 'payload']),
  (data) => data.props.routeParams.id,
  (accounts, accountId) => {
    const accountEntry = accountUtils.findEntry(accounts, accountId);

    if (accountEntry) {
      return accountEntry[1];
    }

    return null;
  },
);

export default compose(
  pure,
  connect((state, ownProps) => {
    return {
      account: accountCurrentSelector({
        state,
        props: ownProps,
      }),
      dialog: state.getIn(['screen', 'dialog']),
      fetched: state.getIn(['accountDetail', 'fetched']),
    };
  }),
)(AccountDetail);
