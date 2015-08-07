'use strict';

var React = require('react');
var Immutable = require('immutable');
var AppBar = require('material-ui/lib/app-bar');
var AppCanvas = require('material-ui/lib/app-canvas');
var Paper = require('material-ui/lib/paper');
var IconButton = require('material-ui/lib/icon-button');
var IconClose = require('material-ui/lib/svg-icons/navigation/close');
var ListItem = require('material-ui/lib/lists/list-item');
var EventListener = require('react-event-listener');

var polyglot = require('polyglot');
var pageAction = require('Main/pageAction');
var FacebookLogin = require('Main/Facebook/Login');

var Settings = React.createClass({
  propTypes: {
    facebook: React.PropTypes.instanceOf(Immutable.Map).isRequired,
  },
  mixins: [
    EventListener,
    React.addons.PureRenderMixin,
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
              {polyglot.t('version') + ' ' + VERSION}
            </ListItem>
            <ListItem disabled={true}>
              <FacebookLogin facebook={this.props.facebook} />
            </ListItem>
          </Paper>
        </div>
      </AppCanvas>;
  },
});

module.exports = Settings;
