'use strict';

var React = require('react');
var AppBar = require('material-ui/lib/app-bar');
var AppCanvas = require('material-ui/lib/app-canvas');
var Paper = require('material-ui/lib/paper');
var IconButton = require('material-ui/lib/icon-button');
var IconClose = require('material-ui/lib/svg-icons/navigation/close');
var ListItem = require('material-ui/lib/lists/list-item');
var FlatButton = require('material-ui/lib/flat-button');
var colors = require('material-ui/lib/styles/colors');
var EventListener = require('react-event-listener');

var polyglot = require('polyglot');
var pageAction = require('Main/pageAction');
var facebookAction = require('Main/Facebook/action');

var styles = {
  facebookEmail: {
    color: colors.grey600,
  },
};

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
    var facebook = this.props.facebook;

    var appBarLeft = <IconButton onTouchTap={this.onTouchTapClose}>
        <IconClose />
      </IconButton>;

    var listItemFacebook;

    if (facebook.get('status') === 'connected') {
      var email;

      if (facebook.get('me')) {
        email = <div style={styles.facebookEmail}>
            {'(' + facebook.getIn(['me', 'email']) + ')'}
          </div>;
      }

      listItemFacebook = <div>
          <div>{polyglot.t('facebook_you_are_logged')}</div>
          {email}
        </div>;
    } else {
      listItemFacebook = <FlatButton label={polyglot.t('facebook_login')} onTouchTap={this.onTouchTapFacebook} />;
    }

    console.log(facebook);

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
            {listItemFacebook}
          </ListItem>
        </Paper>
      </div>
    </AppCanvas>;
  },
});

module.exports = Settings;
