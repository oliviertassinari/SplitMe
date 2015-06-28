'use strict';

var React = require('react');
var AppBar = require('material-ui/lib/app-bar');
var AppCanvas = require('material-ui/lib/app-canvas');
var Paper = require('material-ui/lib/paper');
var IconButton = require('material-ui/lib/icon-button');
var IconClose = require('material-ui/lib/svg-icons/navigation/close');
var ListItem = require('material-ui/lib/lists/list-item');
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
    var appBarLeft = <IconButton onTouchTap={this.onTouchTapClose}>
        <IconClose />
      </IconButton>;

    return <AppCanvas>
      <AppBar title={polyglot.t('settings')}
        iconElementLeft={appBarLeft}
        onLeftIconButtonTouchTap={this.onTouchTapClose} />
      <div className="app-content-canvas">
        <Paper rounded={false}>
          <ListItem disabled={true}>
            {'Version ' + VERSION}
          </ListItem>
        </Paper>
      </div>
    </AppCanvas>;
  }
});

module.exports = Settings;
