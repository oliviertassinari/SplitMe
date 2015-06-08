'use strict';

var React = require('react');
var AppBar = require('material-ui/lib/app-bar');
var AppCanvas = require('material-ui/lib/app-canvas');
var EventListener = require('react-event-listener');

var polyglot = require('polyglot');
var action = require('./action');

var AccountSettings = React.createClass({
  propTypes: {
    account: React.PropTypes.object.isRequired,
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
    action.navigateDetail();
  },
  onTouchTapClose: function(event) {
    event.preventDefault();
    action.navigateDetail();
  },
  render: function() {
    return <AppCanvas>
      <AppBar title={polyglot.t('edit_account')}
        showMenuIconButton={true}
        iconClassNameLeft="md-close"
        onLeftIconButtonTouchTap={this.onTouchTapClose} />
      <div className="app-content-canvas">
      </div>
    </AppCanvas>;
  }
});

module.exports = AccountSettings;
