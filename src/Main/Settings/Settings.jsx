'use strict';

var React = require('react');
var AppBar = require('material-ui/lib/app-bar');
var AppCanvas = require('material-ui/lib/app-canvas');

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
        onLeftIconButtonTouchTap={this.onTouchTapClose}>
      </AppBar>
      <div className="app-content-canvas">
      </div>
    </AppCanvas>;
  }
});

module.exports = Settings;
