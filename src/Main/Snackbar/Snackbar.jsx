import React from 'react';
import Immutable from 'immutable';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import MaterialSnackbar from 'material-ui/lib/snackbar';
import {connect} from 'react-redux';
import polyglot from 'polyglot';

import snackbarActions from 'Main/Snackbar/actions';

const Snackbar = React.createClass({
  propTypes: {
    dispatch: React.PropTypes.func.isRequired,
    snackbar: React.PropTypes.instanceOf(Immutable.Map).isRequired,
  },
  mixins: [
    PureRenderMixin,
  ],
  componentDidUpdate(prevProps) {
    const show = this.props.snackbar.get('show');

    if (prevProps.snackbar.get('show') !== show) {
      const snackbar = this.refs.snackbar;

      // Prevent nested action trigger
      setTimeout(() => {
        if (show) {
          snackbar.show();
        } else {
          snackbar.dismiss();
        }
      }, 0);
    }
  },
  onDismiss() {
    if (this.props.snackbar.get('show')) {
      this.props.dispatch(snackbarActions.dismiss());
    }
  },
  render() {
    const snackbar = this.props.snackbar;

    return (
      <MaterialSnackbar ref="snackbar" message={polyglot.t(snackbar.get('message'))}
        action={snackbar.get('actionMessage')} onActionTouchTap={snackbar.get('actionTouchTap')}
        onDismiss={this.onDismiss} autoHideDuration={3000} data-test="Snackbar" />
    );
  },
});

function mapStateToProps(state) {
  return {
    snackbar: state.get('snackbar'),
  };
}

export default connect(mapStateToProps)(Snackbar);
