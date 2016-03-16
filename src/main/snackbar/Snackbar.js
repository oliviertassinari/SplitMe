import React from 'react';
import pure from 'recompose/pure';
import MaterialSnackbar from 'material-ui/src/snackbar';
import {connect} from 'react-redux';
import polyglot from 'polyglot';

import snackbarActions from 'main/snackbar/actions';

class Snackbar extends React.Component {
  static propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    message: React.PropTypes.string.isRequired,
    open: React.PropTypes.bool.isRequired,
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
        message={polyglot.t(message)}
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
