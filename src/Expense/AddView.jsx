'use strict';

var React = require('react');
var mui = require('material-ui');
var AppBar = mui.AppBar;
var AppCanvas = mui.AppCanvas;
var ToolbarGroup = mui.ToolbarGroup;
var IconButton = mui.IconButton;
var FlatButton = mui.FlatButton;
var Toolbar = mui.Toolbar;
var ToolbarGroup = mui.ToolbarGroup;
var Paper = mui.Paper;

var DetailView = require('./DetailView');
var action = require('./action');

var AddView = React.createClass({

  onTouchTapClose: function() {
    action.tapClose();
  },

  render: function () {
    return <AppCanvas predefinedLayout={1}>
      <AppBar title="New expense" showMenuIconButton={false}>
          <IconButton className="md-close mui-font-icon" onTouchTap={this.onTouchTapClose} />
          <ToolbarGroup key={0} float="right">
            <FlatButton label="Save" secondary={true} />
          </ToolbarGroup>
      </AppBar>
      <div className="mui-app-content-canvas">
        <DetailView />
      </div>
    </AppCanvas>;
  }
});

module.exports = AddView;
