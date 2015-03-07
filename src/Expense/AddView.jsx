'use strict';

var React = require('react');
var mui = require('material-ui');
var AppBar = mui.AppBar;
var AppCanvas = mui.AppCanvas;
var IconButton = mui.IconButton;
var FlatButton = mui.FlatButton;

var Detail = require('./DetailView');
var action = require('./action');

var AddView = React.createClass({
  propTypes: {
    expenseCurrent: React.PropTypes.object.isRequired,
    pageDialog: React.PropTypes.string.isRequired,
  },

  onTouchTapClose: function() {
    action.tapClose();
  },

  onTouchTapSave: function() {
    action.tapSave();
  },

  render: function () {
    return <AppCanvas predefinedLayout={1}>
      <AppBar title="New expense"
        showMenuIconButton={true}
        iconClassNameLeft="md-close"
        onMenuIconButtonTouchTap={this.onTouchTapClose}>
          <FlatButton label="Save" className="expense-save" onTouchTap={this.onTouchTapSave}/>
      </AppBar>
      <div className="mui-app-content-canvas">
        <Detail expense={this.props.expenseCurrent} pageDialog={this.props.pageDialog} />
      </div>
    </AppCanvas>;
  }
});

module.exports = AddView;
