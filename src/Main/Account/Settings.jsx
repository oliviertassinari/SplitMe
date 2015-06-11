'use strict';

var React = require('react');
var AppBar = require('material-ui/lib/app-bar');
var AppCanvas = require('material-ui/lib/app-canvas');
var EventListener = require('react-event-listener');
var Paper = require('material-ui/lib/paper');
var TextField = require('material-ui/lib/text-field');

var polyglot = require('polyglot');
var action = require('./action');
var spacing = require('Main/spacing');

var styles = {
  root: {
    padding: spacing.paperGutter,
  }
};

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
  onChangeName: function() {
  },
  render: function() {
    var account = this.props.account;

    return <AppCanvas>
      <AppBar title={polyglot.t('edit_account')}
        showMenuIconButton={true}
        iconClassNameLeft="md-close"
        onLeftIconButtonTouchTap={this.onTouchTapClose} />
      <div className="app-content-canvas">
        <Paper rounded={false} style={styles.root}>
          <TextField hintText={polyglot.t('name')} defaultValue={account.name} fullWidth={true}
            onChange={this.onChangeName}/>
        </Paper>
      </div>
    </AppCanvas>;
  }
});

module.exports = AccountSettings;
