// @flow weak

import React, { PropTypes, Component } from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import MaterialSnackbar from 'material-ui-build/src/Snackbar';
import { connect } from 'react-redux';
import snackbarActions from 'main/snackbar/actions';

class Snackbar extends Component {
  static propTypes = {
    action: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    message: PropTypes.string.isRequired,
    onActionTouchTap: PropTypes.func,
    open: PropTypes.bool.isRequired,
  };

  handleRequestClose = () => {
    this.props.dispatch(snackbarActions.dismiss());
  };

  render() {
    const {
      message,
      action,
      open,
      onActionTouchTap,
    } = this.props;

    return (
      <MaterialSnackbar
        open={open}
        message={message}
        action={action}
        onRequestClose={this.handleRequestClose}
        onActionTouchTap={onActionTouchTap}
        autoHideDuration={4000}
        data-test="Snackbar"
      />
    );
  }
}

export default compose(
  pure,
  connect((state) => {
    const snackbar = state.get('snackbar');

    return {
      action: snackbar.get('action') || '',
      message: snackbar.get('message'),
      onActionTouchTap: snackbar.get('onActionTouchTap'),
      open: snackbar.get('open'),
    };
  }),
)(Snackbar);
