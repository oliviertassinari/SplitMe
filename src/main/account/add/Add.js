
import React, { PropTypes, Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import IconButton from 'material-ui-build/src/IconButton';
import IconClose from 'material-ui-build/src/svg-icons/navigation/close';
import FlatButton from 'material-ui-build/src/FlatButton';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';
import polyglot from 'polyglot';
import ViewContainer from 'modules/components/ViewContainer';
import LayoutAppBar from 'modules/components/LayoutAppBar';
import LayoutBody from 'modules/components/LayoutBody';
import ScrollView from 'modules/components/ScrollView';
import TextIconError from 'modules/components/TextIconError';
import accountAddActions from 'main/account/add/actions';
import AccountDetail from 'main/account/add/Detail';
import AccountAddCloseHandler from './AddCloseHandler';

class AccountAdd extends Component {
  static propTypes = {
    account: ImmutablePropTypes.map,
    allowExit: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
    fetched: PropTypes.bool.isRequired,
    route: PropTypes.object.isRequired,
    routeParams: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  componentWillMount() {
    this.context.router.setRouteLeaveHook(this.props.route, () => {
      if (this.props.allowExit) {
        return true;
      }

      // Wait for the history to be reset.
      setTimeout(() => {
        this.handleTouchTapClose();
      }, 0);

      return false;
    });
  }

  componentDidMount() {
    const {
      dispatch,
      routeParams,
    } = this.props;

    dispatch(accountAddActions.fetchAdd(routeParams.id));
  }

  componentWillUnmount() {
    this.props.dispatch(accountAddActions.unmount());
  }

  handleTouchTapClose = (event) => {
    if (event) {
      event.preventDefault();
    }

    const {
      dispatch,
      routeParams,
    } = this.props;

    setTimeout(() => {
      dispatch(accountAddActions.navigateBack(routeParams.id));
    }, 0);
  };

  handleTouchTapSave = () => {
    setTimeout(() => {
      this.props.dispatch(accountAddActions.tapSave(this.props.routeParams.id));
    }, 0);
  };

  render() {
    const {
      routeParams: {
        id: accountId,
      },
      account,
      fetched,
    } = this.props;

    const appBarLeft = (
      <IconButton onTouchTap={this.handleTouchTapClose}>
        <IconClose />
      </IconButton>
    );

    let title;

    if (accountId) {
      title = polyglot.t('account_edit');
    } else {
      title = polyglot.t('account_add_new');
    }

    let appBarRight;
    let body;

    if (fetched) {
      if (account) {
        appBarRight = (
          <FlatButton
            label={polyglot.t('save')}
            onTouchTap={this.handleTouchTapSave}
            data-test="AccountAddSave"
          />
        );
        body = <AccountDetail account={account} />;
      } else if (accountId) {
        body = <TextIconError text={polyglot.t('account_not_found')} />;
      }
    }

    return (
      <ViewContainer>
        {(process.env.PLATFORM === 'browser' || process.env.PLATFORM === 'server') && (
          <DocumentTitle title={title} />
        )}
        <LayoutAppBar
          title={title}
          iconElementLeft={appBarLeft}
          iconElementRight={appBarRight}
        />
        <ScrollView>
          <LayoutBody>
            {body}
          </LayoutBody>
        </ScrollView>
        <AccountAddCloseHandler accountId={accountId} />
      </ViewContainer>
    );
  }
}

export default compose(
  pure,
  connect((state) => {
    const accountAdd = state.get('accountAdd');

    return {
      account: accountAdd.get('current'),
      allowExit: accountAdd.get('allowExit'),
      fetched: accountAdd.get('fetched'),
    };
  }),
)(AccountAdd);
