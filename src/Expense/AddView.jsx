'use strict';

var React = require('react');
var mui = require('material-ui');
var AppBar = mui.AppBar;
var AppCanvas = mui.AppCanvas;
var IconButton = mui.IconButton;
var FlatButton = mui.FlatButton;
var Dialog = mui.Dialog;

var Detail = require('./DetailView');
var action = require('./action');

var AddView = React.createClass({
  propTypes: {
    expense: React.PropTypes.object.isRequired,
    pageDialog: React.PropTypes.string.isRequired,
  },

  onTouchTapClose: function(event) {
    event.preventDefault();
    action.tapClose();
  },

  onTouchTapSave: function(event) {
    event.preventDefault();
    action.tapSave();
  },

  onTouchTapDelete: function() {
    this.refs.dialogDelete.show();
  },

  render: function () {
    var expense = this.props.expense;
    var title;
    var bottom;
    var className = 'mui-app-content-canvas';
    var dialogDelete;

    if(expense._id) {
      title = 'Edit expense';
      className += ' button-bottom-padding';
      bottom = <div className="button-bottom">
        <FlatButton label="DELETE" onTouchTap={this.onTouchTapDelete} />
      </div>;

      var dialogTitle = '';
      var actions = [
        { text: 'Cancel' },
        { text: 'OK', onClick: this._onDialogSubmit }
      ];
      dialogDelete = <Dialog title={dialogTitle} ref="dialogDelete" actions={actions}>
        <div className="mui-font-style-subhead-1">Delete this expense?</div>
      </Dialog>;
    } else {
      title = 'New expense';
    }

    return <AppCanvas predefinedLayout={1}>
      <AppBar title={title}
        showMenuIconButton={true}
        iconClassNameLeft="md-close"
        onMenuIconButtonTouchTap={this.onTouchTapClose}>
          <FlatButton label="Save" className="expense-save" onTouchTap={this.onTouchTapSave}/>
      </AppBar>
      <div className={className}>
        <Detail expense={this.props.expense} pageDialog={this.props.pageDialog} />
      </div>
      {bottom}
      {dialogDelete}
    </AppCanvas>;
  }
});

module.exports = AddView;
