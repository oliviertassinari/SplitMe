'use strict';

var React = require('react');
var Immutable = require('immutable');
// var _ = require('underscore');
var AppBar = require('material-ui/lib/app-bar');
var AppCanvas = require('material-ui/lib/app-canvas');
var EventListener = require('react-event-listener');
var Paper = require('material-ui/lib/paper');
var TextField = require('material-ui/lib/text-field');
var ListItem = require('material-ui/lib/lists/list-item');
var IconButton = require('material-ui/lib/icon-button');
var IconClose = require('material-ui/lib/svg-icons/navigation/close');
// var IconShare = require('material-ui/lib/svg-icons/social/share');
var IconPeople = require('material-ui/lib/svg-icons/social/people');
var FlatButton = require('material-ui/lib/flat-button');
// var Toggle = require('material-ui/lib/toggle');
// var IconAdd = require('material-ui/lib/svg-icons/content/add');
// var Avatar = require('material-ui/lib/avatar');
var connect = require('react-redux').connect;

var utils = require('utils');
var polyglot = require('polyglot');
var contacts = require('contacts');
var accountAddActions = require('Main/Account/Add/actions');
var MemberAvatar = require('Main/MemberAvatar');

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
    account: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    dispatch: React.PropTypes.func.isRequired,
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
    this.props.dispatch(accountAddActions.navigateBack());
  },
  onTouchTapClose: function(event) {
    event.preventDefault();
    var dispatch = this.props.dispatch;

    setTimeout(function() {
      dispatch(accountAddActions.close());
    }, 0);
  },
  onTouchTapSave: function(event) {
    event.preventDefault();
    var dispatch = this.props.dispatch;

    setTimeout(function() {
      dispatch(accountAddActions.tapSave());
    }, 0);
  },
  onChangeName: function(event) {
    this.props.dispatch(accountAddActions.changeName(event.target.value));
  },
  onTouchTapAdd: function() {
    contacts.pickContact().then(this.props.dispatch(accountAddActions.pickContact));
  },
  onToggleShare: function(event, toggle) {
    this.props.dispatch(accountAddActions.toggleShare(toggle));
  },
  onChangeEmail: function(memberId, event) {
    this.props.dispatch(accountAddActions.changeMemberEmail(event.target.value, memberId));
  },
  render: function() {
    var account = this.props.account;

    var appBarLeft = <IconButton onTouchTap={this.onTouchTapClose}>
        <IconClose />
      </IconButton>;

    var appBarRight = <FlatButton label={polyglot.t('save')}
      onTouchTap={this.onTouchTapSave} className="testAccountEditSave" />;

    var self = this;

    // var avatarAdd = <Avatar icon={<IconAdd />} color="#000" backgroundColor="#fff" />;

    return <AppCanvas>
        <AppBar title={polyglot.t('account_edit')} className="testAppBar"
          iconElementLeft={appBarLeft}
          iconElementRight={appBarRight} />
        <div className="app-content-canvas">
          <Paper rounded={false}>
            <ListItem disabled={true} primaryText={
              <TextField hintText={polyglot.t('account_name_hint')}
                defaultValue={utils.getNameAccount(account)} fullWidth={true}
                onChange={this.onChangeName} style={styles.listItemBody} floatingLabelText={polyglot.t('name')}
               className="testAccountEditName" />
            } />
            {/*<ListItem disabled={true} leftIcon={<IconShare />}>
              <div style={_.extend({}, styles.listItemBody, styles.listItemPrimaryText)}>
                <ListItem primaryText={polyglot.t('account_add_shared')} rightToggle={
                    <Toggle defaultToggled={account.share} onToggle={this.onToggleShare} />
                  } />
              </div>
            }/>*/}
            <ListItem disabled={true} leftIcon={<IconPeople />} primaryText={
              <div>
                {polyglot.t('members')}
                {account.get('members').map(function(member) {
                  return <ListItem key={member.get('id')} disabled={true}
                      leftAvatar={<MemberAvatar member={member} />}
                      primaryText={
                        <div>
                          {utils.getNameMember(member)}
                          {account.get('share') &&
                            <TextField hintText={polyglot.t('email')}
                              defaultValue={member.get('email')} fullWidth={true}
                              onChange={self.onChangeEmail.bind(self, member.get('id'))} style={styles.listItemBody}
                              className="testAccountEditName" />
                          }
                        </div>
                      } />;
                })}
                {/*<ListItem leftAvatar={avatarAdd} onTouchTap={this.onTouchTapAdd}>
                  {polyglot.t('add_a_new_person')}
                }/>*/}
              </div>
            } />
          </Paper>
        </div>
      </AppCanvas>;
  },
});

module.exports = connect()(AccountAdd);
