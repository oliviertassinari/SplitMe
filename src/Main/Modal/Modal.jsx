'use strict';

var React = require('react');
var _ = require('underscore');
var mui = require('material-ui');
var Dialog = mui.Dialog;

var polyglot = require('../../polyglot');
var modalAction = require('./action');

var Modal = React.createClass({
  propTypes: {
    pageDialog: React.PropTypes.string.isRequired,
    actions: React.PropTypes.array.isRequired,
    title: React.PropTypes.string.isRequired,
  },

  shouldComponentUpdate: function(nextProps) {
    if(this.props.pageDialog !== nextProps.pageDialog) { // This will failed here most of the time
      if(this.props.pageDialog === 'modal' || nextProps.pageDialog === 'modal') { // a modal is involved
        return true;
      }
    }

    return false;
  },

  // We receive a open !=
  componentWillUpdate: function(nextProps) {
    var modalDialog = this.refs.modalDialog;
    var from = this.props.pageDialog;
    var to = nextProps.pageDialog;

    // Prevent the dispatch inside a dispatch
    setTimeout(function() {
      if(from === 'modal') {
        modalDialog.dismiss();
      }

      if(to === 'modal') {
        modalDialog.show();
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

  render: function () {
    var self = this;

    var actions = _.map(this.props.actions, function(action) {
      if (action.triggerOK) {
        action.onClick = self.onClickOK.bind(self, action.triggerName);
      }

      action.text = polyglot.t(action.textKey);

      return action;
    });

    return <Dialog ref="modalDialog" actions={actions} onDismiss={this.onDismiss}>
      <div className="mui-font-style-subhead-1">{polyglot.t(this.props.title)}</div>
    </Dialog>;
  },
});

module.exports = Modal;
