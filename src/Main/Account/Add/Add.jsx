'use strict';

var React = require('react');
var _ = require('underscore');
var AppBar = require('material-ui/lib/app-bar');
var AppCanvas = require('material-ui/lib/app-canvas');
var EventListener = require('react-event-listener');
var Paper = require('material-ui/lib/paper');
var TextField = require('material-ui/lib/text-field');
var ListItem = require('material-ui/lib/lists/list-item');
var IconButton = require('material-ui/lib/icon-button');
var IconClose = require('material-ui/lib/svg-icons/navigation/close');
var IconShare = require('material-ui/lib/svg-icons/social/share');
var IconPeople = require('material-ui/lib/svg-icons/social/people');
var FlatButton = require('material-ui/lib/flat-button');
var Toggle = require('material-ui/lib/toggle');
// var IconAdd = require('material-ui/lib/svg-icons/content/add');
// var Avatar = require('material-ui/lib/avatar');

var utils = require('utils');
var polyglot = require('polyglot');
var contacts = require('contacts');
var action = require('./action');
var MemberAvatar = require('Main/MemberAvatar');
var pageStore = require('Main/pageStore');
var pageAction = require('Main/pageAction');
var modalAction = require('Main/Modal/action');

var styles = {
  listItemBody: {
    margin: '-16px 0 0',
  },
  listItemPrimaryText: {
    marginLeft: -16,
  },
};

var AccountAdd = React.createClass({
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
    if (pageStore.getDialog() === '') {
      modalAction.show({
        actions: [
          { textKey: 'delete', triggerOK: true, triggerName: 'closeAccountAdd' },
          { textKey: 'cancel' },
        ],
        title: 'account_add_confirm_delete_edit',
      });
    } else {
      pageAction.dismissDialog();
    }
  },
  onTouchTapClose: function(event) {
    event.preventDefault();
    action.tapClose();
  },
  onTouchTapSave: function(event) {
    event.preventDefault();
    action.tapSave();
  },
  onChangeName: function(event) {
    action.changeName(event.target.value);
  },
  onTouchTapAdd: function() {
    contacts.pickContact().then(action.pickContact);
  },
  onToggleShare: function(event, toggle) {
    action.toggleShare(toggle);
  },
  render: function() {
    var account = this.props.account;

    var appBarLeft = <IconButton onTouchTap={this.onTouchTapClose}>
        <IconClose />
      </IconButton>;

    var appBarRight = <FlatButton label={polyglot.t('save')}
      onTouchTap={this.onTouchTapSave} className="testAccountEditSave" />;

    // var avatarAdd = <Avatar icon={<IconAdd />} color="#000" backgroundColor="#fff" />;

    return <AppCanvas>
      <AppBar title={polyglot.t('account_edit')} className="testAppBar"
        iconElementLeft={appBarLeft}
        iconElementRight={appBarRight} />
      <div className="app-content-canvas">
        <Paper rounded={false}>
          <ListItem disabled={true}>
            <TextField hintText={polyglot.t('account_name_hint')}
              defaultValue={utils.getNameAccount(account)} fullWidth={true}
              onChange={this.onChangeName} style={styles.listItemBody} floatingLabelText={polyglot.t('name')}
              className="testAccountEditName" />
          </ListItem>
          <ListItem disabled={true} leftIcon={<IconShare />}>
            <div style={_.extend({}, styles.listItemBody, styles.listItemPrimaryText)}>
              <ListItem primaryText={polyglot.t('account_add_shared')} rightToggle={
                  <Toggle defaultToggled={account.shared} onToggle={this.onToggleShare} />
                } />
            </div>
          </ListItem>
          <ListItem disabled={true} leftIcon={<IconPeople />}>
            <div>
              {polyglot.t('members')}
              {account.members.map(function (member) {
                var avatar = <MemberAvatar member={member} />;
                return <ListItem disabled={true} leftAvatar={avatar} key={member.id}>
                  {utils.getDisplayNameMember(member)}
                  </ListItem>;
              })}
              {/*<ListItem leftAvatar={avatarAdd} onTouchTap={this.onTouchTapAdd}>
                {polyglot.t('add_a_new_person')}
              </ListItem>*/}
            </div>
          </ListItem>
        </Paper>
      </div>
    </AppCanvas>;
  },
});

module.exports = AccountAdd;
