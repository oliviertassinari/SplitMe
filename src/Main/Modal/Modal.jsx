'use strict';

var React = require('react');
var _ = require('underscore');
var Dialog = require('material-ui/lib/dialog');

var polyglot = require('polyglot');
var modalAction = require('Main/Modal/action');

var styles = {
  body: {
    paddingBottom: 10,
  },
};

var Modal = React.createClass({
  propTypes: {
    actions: React.PropTypes.array.isRequired,
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
    });
  },
  onClickOK: function(triggerName) {
    this.onDismiss(); // The dialog doesn't trigger it when an a action has an onClick key
    modalAction.tapOK(triggerName);
  },
  onDismiss: function() {
    modalAction.dismiss();
  },
  render: function() {
    var self = this;

    var actions = _.map(this.props.actions, function(action) {
        if (action.triggerOK) {
          action.onClick = self.onClickOK.bind(self, action.triggerName);
        }

        action.text = polyglot.t(action.textKey);

        return action;
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

module.exports = Modal;
