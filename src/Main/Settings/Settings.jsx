'use strict';

var React = require('react');
var AppBar = require('material-ui/lib/app-bar');
var AppCanvas = require('material-ui/lib/app-canvas');
var Paper = require('material-ui/lib/paper');
var EventListener = require('react-event-listener');

var polyglot = require('polyglot');
var pageAction = require('Main/pageAction');

var Settings = React.createClass({
  mixins: [
    EventListener,
  ],
  listeners: {
    document: {
      backbutton: 'onBackButton',
    },
  },
  onBackButton: function() {
    pageAction.navigateHome();
  },
  onTouchTapClose: function(event) {
    event.preventDefault();
    pageAction.navigateHome();
  },
  render: function() {
    return <AppCanvas>
      <AppBar title={polyglot.t('settings')}
        showMenuIconButton={true}
        iconClassNameLeft="md-close"
        onLeftIconButtonTouchTap={this.onTouchTapClose} />
      <div className="app-content-canvas">
        <Paper>
          Version 0.0.8
        </Paper>
      </div>
    </AppCanvas>;
  }
});

module.exports = Settings;
