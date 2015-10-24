'use strict';

const React = require('react');
const Immutable = require('immutable');
const PureRenderMixin = require('react-addons-pure-render-mixin');
const MaterialSnackbar = require('material-ui/src/snackbar');
const {connect} = require('react-redux');
const polyglot = require('polyglot');

const snackbarActions = require('Main/Snackbar/actions');

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

module.exports = connect(mapStateToProps)(Snackbar);
