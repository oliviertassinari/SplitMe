import React, {PropTypes, Component} from 'react';
import pure from 'recompose/pure';
import MaterialSnackbar from 'material-ui-build/src/Snackbar';
import {connect} from 'react-redux';
import polyglot from 'polyglot';

import snackbarActions from 'main/snackbar/actions';

class Snackbar extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    message: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
  };

  handleRequestClose = () => {
    this.props.dispatch(snackbarActions.dismiss());
  };

  render() {
    const {
      message,
      open,
    } = this.props;

    return (
      <MaterialSnackbar
        open={open}
        message={message ? polyglot.t(message) : ''}
        onRequestClose={this.handleRequestClose}
        autoHideDuration={3000}
        data-test="Snackbar"
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    message: state.getIn(['snackbar', 'message']),
    open: state.getIn(['snackbar', 'open']),
  };
}

export default pure(connect(mapStateToProps)(Snackbar));
