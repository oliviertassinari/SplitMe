import React from 'react';
import Immutable from 'immutable';
import pure from 'recompose/pure';
import AppBar from 'material-ui/src/AppBar';
import EventListener from 'react-event-listener';
import IconButton from 'material-ui/src/IconButton';
import IconClose from 'material-ui/src/svg-icons/navigation/close';
import FlatButton from 'material-ui/src/FlatButton';
import {connect} from 'react-redux';
import DocumentTitle from 'react-document-title';

import polyglot from 'polyglot';
import CanvasHead from 'main/canvas/Head';
import CanvasBody from 'main/canvas/Body';
import TextIcon from 'main/TextIcon';
import accountAddActions from 'main/account/add/actions';
import AccountDetail from 'main/account/add/Detail';

class AccountAdd extends React.Component {
  static propTypes = {
    account: React.PropTypes.instanceOf(Immutable.Map),
    dispatch: React.PropTypes.func.isRequired,
    fetched: React.PropTypes.bool.isRequired,
    routeParams: React.PropTypes.shape({
      id: React.PropTypes.string,
    }).isRequired,
  };

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

  handleBackButton = () => {
    const {
      dispatch,
      routeParams,
    } = this.props;

    dispatch(accountAddActions.navigateBack(routeParams.id));
  };

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
        <EventListener elementName="document" onBackButton={this.handleBackButton} />
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
    fetched: accountAdd.get('fetched'),
    account: accountAdd.get('current'),
  };
}

export default pure(connect(mapStateToProps)(AccountAdd));
