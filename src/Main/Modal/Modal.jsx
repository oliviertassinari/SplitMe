'use strict';

var React = require('react');
var _ = require('underscore');
var mui = require('material-ui');
var Dialog = mui.Dialog;

var action = require('../action');
var modalAction = require('./action');

var Modal = React.createClass({
  propTypes: {
    pageDialog: React.PropTypes.string.isRequired,
    actions: React.PropTypes.array.isRequired,
  },

  shouldComponentUpdate: function(nextProps) {
    if(this.props.pageDialog !== nextProps.pageDialog) { // This will failed here most of the time
      if(this.props.pageDialog === '' && nextProps.pageDialog === 'modal') {
        return true;
      } else if(this.props.pageDialog === 'modal' && nextProps.pageDialog === '') {
        return true;
      }
    }

    return false;
  },

  // We receive a open !=
  componentWillUpdate: function(nextProps) {
    this.dontAction = true;
    var modalDialog = this.refs.modalDialog;

    if(nextProps.pageDialog === '') {
      modalDialog.dismiss();
    } else {
      modalDialog.show();
    }

    this.dontAction = false;
  },

  onClickOK: function(triggerName) {
    action.dismissDialog();
    modalAction.tapOK(triggerName);
  },

  onDismiss: function() {
    if(!this.dontAction) {
      action.dismissDialog();
    }
  },

  render: function () {
    var self = this;

    var actions = _.map(this.props.actions, function(action) {
      if(action.triggerOK) {
        action.onClick = self.onClickOK.bind(self, action.triggerName);
      }

      return action;
    });

    return <Dialog ref="modalDialog" actions={actions} onDismiss={this.onDismiss}>
      {this.props.children}
    </Dialog>;
  },
});

module.exports = Modal;
