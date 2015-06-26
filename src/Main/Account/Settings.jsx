'use strict';

var React = require('react');
var AppBar = require('material-ui/lib/app-bar');
var AppCanvas = require('material-ui/lib/app-canvas');
var EventListener = require('react-event-listener');
var Paper = require('material-ui/lib/paper');
var TextField = require('material-ui/lib/text-field');
var ListItem = require('material-ui/lib/lists/list-item');
var IconButton = require('material-ui/lib/icon-button');
var IconClose = require('material-ui/lib/svg-icons/navigation/close');
var IconPeople = require('material-ui/lib/svg-icons/social/people');

var utils = require('utils');
var polyglot = require('polyglot');
var action = require('./action');
var MembersAvatar = require('Main/MembersAvatar');

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

    var appBarLeft = <IconButton onTouchTap={this.onTouchTapClose}>
        <IconClose />
      </IconButton>;

    return <AppCanvas>
      <AppBar title={polyglot.t('edit_account')}
        iconElementLeft={appBarLeft} />
      <div className="app-content-canvas">
        <Paper rounded={false}>
          <ListItem disabled={true}>
            <TextField hintText={polyglot.t('name')} defaultValue={account.name} fullWidth={true}
            onChange={this.onChangeName} />
          </ListItem>
          <ListItem disabled={true} leftIcon={<IconPeople />}>
            Members
            {account.members.map(function (member) {
              var avatar = <MembersAvatar member={member} />;
              return <ListItem disabled={true} leftAvatar={avatar} key={member.id}>
                {utils.getDisplayName(member)}
                </ListItem>;
            })}
          </ListItem>
        </Paper>
      </div>
    </AppCanvas>;
  }
});

module.exports = AccountSettings;
