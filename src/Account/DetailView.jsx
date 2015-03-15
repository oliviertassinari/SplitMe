'use strict';

var React = require('react');
var _ = require('underscore');
var mui = require('material-ui');
var AppCanvas = mui.AppCanvas;
var AppBar = mui.AppBar;
var FloatingActionButton = mui.FloatingActionButton;
var Paper = mui.Paper;

var List = require('../List/View');
var action = require('./action');
var Avatar = require('../Avatar/View');

var DetailView = React.createClass({
  propTypes: {
    account: React.PropTypes.object.isRequired,
  },

  onTouchTapAddExpense: function(event) {
    event.preventDefault();
    action.tapAddExpense();
  },

  onTouchTapClose: function() {
    action.tapClose();
  },

  render: function () {
    var self = this;

    return <AppCanvas predefinedLayout={1}>
      <AppBar title={this.props.account.name}
        showMenuIconButton={true}
        iconClassNameLeft="md-close"
        onMenuIconButtonTouchTap={this.onTouchTapClose}>
      </AppBar>
      <div className="mui-app-content-canvas">
        <Paper zDepth={1} rounded={false}>
          echo
        </Paper>
        <div id="main-button">
          <FloatingActionButton
            iconClassName="md-add"
            secondary={true}
            onTouchTap={this.onTouchTapAddExpense} />
        </div>
      </div>
    </AppCanvas>;
  }
});

module.exports = DetailView;
