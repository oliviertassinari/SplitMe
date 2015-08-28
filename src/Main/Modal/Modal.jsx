'use strict';

var React = require('react');
var Immutable = require('immutable');
var Dialog = require('material-ui/lib/dialog');
var connect = require('react-redux').connect;

var polyglot = require('polyglot');
var modalActions = require('Main/Modal/actions');

var styles = {
  body: {
    paddingBottom: 10,
  },
};

var Modal = React.createClass({
  propTypes: {
    actions: React.PropTypes.instanceOf(Immutable.List).isRequired,
    dispatch: React.PropTypes.func.isRequired,
    pageDialog: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
  },
  shouldComponentUpdate: function(nextProps) {
    if (this.props.pageDialog !== nextProps.pageDialog) { // This will failed here most of the time
      if (this.props.pageDialog === 'modal' || nextProps.pageDialog === 'modal') { // a modal is involved
        return true;
      }
    }

    return false;
  },
  // We receive != pageDialog
  componentWillUpdate: function(nextProps) {
    var from = this.props.pageDialog;
    var to = nextProps.pageDialog;
    var dialog = this.refs.dialog;

    // Prevent the dispatch inside a dispatch
    setTimeout(function() {
      if (from === 'modal') {
        dialog.dismiss();
      }

      if (to === 'modal') {
        dialog.show();
      }
    }, 0);
  },
  onClickOK: function(triggerName) {
    this.onDismiss(); // The dialog doesn't trigger it when an a action has an onClick key
    this.props.dispatch(modalActions.tapOK(triggerName));
  },
  onDismiss: function() {
    this.props.dispatch(modalActions.dismiss());
  },
  render: function() {
    var self = this;

    var actions = [];

    this.props.actions.forEach(function(action) {
      var actionRow = {
        text: polyglot.t(action.get('textKey')),
      };

      if (action.get('triggerOK')) {
        actionRow.onClick = self.onClickOK.bind(self, action.get('triggerName'));
      }

      actions.push(actionRow);
    });

    var title = null;

    if (this.props.title) {
      title = <div>{polyglot.t(this.props.title)}</div>;
    }

    return <Dialog ref="dialog" actions={actions} onDismiss={this.onDismiss} contentClassName="testModal"
        bodyStyle={styles.body}>
        {title}
      </Dialog>;
  },
});

module.exports = connect()(Modal);
