import React from 'react';
import pure from 'recompose/pure';
import MaterialSnackbar from 'material-ui/lib/snackbar';
import {connect} from 'react-redux';
import polyglot from 'polyglot';

import snackbarActions from 'Main/Snackbar/actions';

class Snackbar extends React.Component {
  static propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    message: React.PropTypes.string.isRequired,
    open: React.PropTypes.bool.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.handleRequestClose = this.handleRequestClose.bind(this);
  }

  handleRequestClose() {
    this.props.dispatch(snackbarActions.dismiss());
  }

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

export default connect(mapStateToProps)(pure(Snackbar));
