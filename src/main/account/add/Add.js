import React, {PropTypes, Component} from 'react';
import Immutable from 'immutable';
import pure from 'recompose/pure';
import AppBar from 'material-ui-build/src/AppBar';
import IconButton from 'material-ui-build/src/IconButton';
import IconClose from 'material-ui-build/src/svg-icons/navigation/close';
import FlatButton from 'material-ui-build/src/FlatButton';
import {connect} from 'react-redux';
import DocumentTitle from 'react-document-title';

import polyglot from 'polyglot';
import CanvasHead from 'main/canvas/Head';
import CanvasBody from 'main/canvas/Body';
import TextIcon from 'main/TextIcon';
import accountAddActions from 'main/account/add/actions';
import AccountDetail from 'main/account/add/Detail';

class AccountAdd extends Component {
  static propTypes = {
    account: PropTypes.instanceOf(Immutable.Map),
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
      if (!this.props.allowExit) {
        // Wait for the history to go back on the original root.
        setTimeout(() => {
          this.handleTouchTapClose();
        }, 100);
      }
      return this.props.allowExit;
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

  handleTouchTapClose = () => {
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
      routeParams,
      account,
      fetched,
    } = this.props;

    const appBarLeft = (
      <IconButton onTouchTap={this.handleTouchTapClose}>
        <IconClose />
      </IconButton>
    );

    let title;

    if (routeParams.id) {
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
      } else if (routeParams.id) {
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
            iconElementLeft={appBarLeft}
            iconElementRight={appBarRight}
            data-test="AppBar"
          />
        </CanvasHead>
        <CanvasBody>
          {body}
        </CanvasBody>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const accountAdd = state.get('accountAdd');

  return {
    account: accountAdd.get('current'),
    allowExit: accountAdd.get('allowExit'),
    fetched: accountAdd.get('fetched'),
  };
}

export default pure(connect(mapStateToProps)(AccountAdd));
