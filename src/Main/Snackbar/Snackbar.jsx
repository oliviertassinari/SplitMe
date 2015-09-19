'use strict';

const React = require('react');
const Immutable = require('immutable');
const PureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');
const MaterialSnackbar = require('material-ui/lib/snackbar');
const {connect} = require('react-redux');

const snackbarActions = require('Main/Snackbar/actions');

const Snackbar = React.createClass({
  propTypes: {
    dispatch: React.PropTypes.func.isRequired,
    snackbar: React.PropTypes.instanceOf(Immutable.Map).isRequired,
  },
  mixins: [
    PureRenderMixin,
  ],
  componentDidUpdate: function(prevProps) {
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
  onDismiss: function() {
    this.props.dispatch(snackbarActions.dismiss());
  },
  render: function() {
    const snackbar = this.props.snackbar;

    return (
      <MaterialSnackbar ref="snackbar" message={snackbar.get('message')} action={snackbar.get('actionMessage')}
        onActionTouchTap={snackbar.get('actionTouchTap')} onDismiss={this.onDismiss} autoHideDuration={2500} />
    );
  },

});

module.exports = connect()(Snackbar);
