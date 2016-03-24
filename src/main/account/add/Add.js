import React from 'react';
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
import accountAddActions from 'main/account/add/actions';
import AccountDetail from 'main/account/add/Detail';

class AccountAdd extends React.Component {
  static propTypes = {
    dispatch: React.PropTypes.func.isRequired,
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
    } = this.props;

    const appBarLeft = (
      <IconButton onTouchTap={this.handleTouchTapClose}>
        <IconClose />
      </IconButton>
    );

    const appBarRight = (
      <FlatButton
        label={polyglot.t('save')}
        onTouchTap={this.handleTouchTapSave}
        data-test="AccountAddSave"
      />
    );

    let title;

    if (routeParams.id) {
      title = polyglot.t('account_edit');
    } else {
      title = polyglot.t('account_add_new');
    }

    return (
      <div>
        {(process.env.PLATFORM === 'browser' || process.env.PLATFORM === 'server') &&
          <DocumentTitle title={title} />
        }
        <EventListener elementName="document" onBackButton={this.handleBackButton} />
        <CanvasHead>
          <AppBar
            title={title} data-test="AppBar"
            iconElementLeft={appBarLeft} iconElementRight={appBarRight}
          />
        </CanvasHead>
        <CanvasBody>
          <AccountDetail />
        </CanvasBody>
      </div>
    );
  }
}

export default pure(connect()(AccountAdd));
