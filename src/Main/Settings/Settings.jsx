'use strict';

var React = require('react');
var mui = require('material-ui');
var AppBar = mui.AppBar;
var AppCanvas = mui.AppCanvas;

var polyglot = require('../../polyglot');
var pageAction = require('../pageAction');

var Settings = React.createClass({
  onTouchTapClose: function(event) {
    event.preventDefault();
    pageAction.navigateHome();
  },

  render: function() {
    return <AppCanvas predefinedLayout={1}>
      <AppBar title={polyglot.t('settings')}
        showMenuIconButton={true}
        iconClassNameLeft="md-close"
        onMenuIconButtonTouchTap={this.onTouchTapClose}>
      </AppBar>
      <div className="mui-app-content-canvas">
      </div>
    </AppCanvas>;
  }
});

module.exports = Settings;
