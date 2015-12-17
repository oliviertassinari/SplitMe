import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import MaterialSnackbar from 'material-ui/lib/snackbar';
import {connect} from 'react-redux';
import polyglot from 'polyglot';

import snackbarActions from 'Main/Snackbar/actions';

const Snackbar = React.createClass({
  propTypes: {
    dispatch: React.PropTypes.func.isRequired,
    message: React.PropTypes.string.isRequired,
    open: React.PropTypes.bool.isRequired,
  },
  mixins: [
    PureRenderMixin,
  ],
  handleRequestClose() {
    this.props.dispatch(snackbarActions.dismiss());
  },
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
  },
});

function mapStateToProps(state) {
  return {
    message: state.getIn(['snackbar', 'message']),
    open: state.getIn(['snackbar', 'open']),
  };
}

export default connect(mapStateToProps)(Snackbar);
