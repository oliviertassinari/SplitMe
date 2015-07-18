'use strict';

var React = require('react');
var AppBar = require('material-ui/lib/app-bar');
var AppCanvas = require('material-ui/lib/app-canvas');
var Paper = require('material-ui/lib/paper');
var IconButton = require('material-ui/lib/icon-button');
var IconClose = require('material-ui/lib/svg-icons/navigation/close');
var ListItem = require('material-ui/lib/lists/list-item');
var FlatButton = require('material-ui/lib/flat-button');
var EventListener = require('react-event-listener');

var polyglot = require('polyglot');
var pageAction = require('Main/pageAction');
var facebookAction = require('Main/Facebook/action');

var Settings = React.createClass({
  propTypes: {
    facebook: React.PropTypes.object.isRequired,
  },
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
  onTouchTapFacebook: function() {
    facebookAction.login();
  },
  render: function() {
    var appBarLeft = <IconButton onTouchTap={this.onTouchTapClose}>
        <IconClose />
      </IconButton>;

    var listItemFacebook;

    console.log('render', this.props.facebook);

    if (this.props.facebook.status === 'connected') {
      listItemFacebook = 'You are logged with facebook';
    } else {
      listItemFacebook = <FlatButton label="Sign in with Facebook" onTouchTap={this.onTouchTapFacebook} />;
    }

    return <AppCanvas>
      <AppBar title={polyglot.t('settings')}
        iconElementLeft={appBarLeft}
        onLeftIconButtonTouchTap={this.onTouchTapClose} />
      <div className="app-content-canvas">
        <Paper rounded={false}>
          <ListItem disabled={true}>
            {'Version ' + VERSION}
          </ListItem>
          <ListItem disabled={true}>
            {listItemFacebook}
          </ListItem>
        </Paper>
      </div>
    </AppCanvas>;
  }
});

module.exports = Settings;
