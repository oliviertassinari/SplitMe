'use strict';

var React = require('react');
var AppBar = require('material-ui/lib/app-bar');
var AppCanvas = require('material-ui/lib/app-canvas');

var polyglot = require('polyglot');

var AccountSettings = React.createClass({
  onTouchTapClose: function(event) {
    event.preventDefault();
  },
  render: function() {
    return <AppCanvas>
      <AppBar title={polyglot.t('settings')}
        showMenuIconButton={true}
        iconClassNameLeft="md-close"
        onLeftIconButtonTouchTap={this.onTouchTapClose} />
      <div className="app-content-canvas">
      </div>
    </AppCanvas>;
  }
});

module.exports = AccountSettings;
