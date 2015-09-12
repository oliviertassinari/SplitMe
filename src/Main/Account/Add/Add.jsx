'use strict';

const React = require('react');
const PureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');
const Immutable = require('immutable');
// const _ = require('underscore');
const AppBar = require('material-ui/lib/app-bar');
const EventListener = require('react-event-listener');
const Paper = require('material-ui/lib/paper');
const TextField = require('material-ui/lib/text-field');
const ListItem = require('material-ui/lib/lists/list-item');
const IconButton = require('material-ui/lib/icon-button');
const IconClose = require('material-ui/lib/svg-icons/navigation/close');
// let IconShare = require('material-ui/lib/svg-icons/social/share');
const IconPeople = require('material-ui/lib/svg-icons/social/people');
const FlatButton = require('material-ui/lib/flat-button');
// let Toggle = require('material-ui/lib/toggle');
// const IconAdd = require('material-ui/lib/svg-icons/content/add');
// let Avatar = require('material-ui/lib/avatar');
const {connect} = require('react-redux');

const accountUtils = require('Main/Account/utils');
const polyglot = require('polyglot');
const contacts = require('contacts');
const CanvasHead = require('Main/Canvas/Head');
const CanvasBody = require('Main/Canvas/Body');
const accountAddActions = require('Main/Account/Add/actions');
const MemberAvatar = require('Main/MemberAvatar');

const styles = {
  listItemBody: {
    margin: '-16px 0 0',
  },
  listItemPrimaryText: {
    marginLeft: -16,
  },
};

const AccountAdd = React.createClass({
  propTypes: {
    account: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    dispatch: React.PropTypes.func.isRequired,
  },
  mixins: [
    EventListener,
    PureRenderMixin,
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

    setTimeout(() => {
      this.props.dispatch(accountAddActions.close());
    }, 0);
  },
  onTouchTapSave: function(event) {
    event.preventDefault();

    setTimeout(() => {
      this.props.dispatch(accountAddActions.tapSave());
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
    const account = this.props.account;

    const appBarLeft = <IconButton onTouchTap={this.onTouchTapClose}>
        <IconClose />
      </IconButton>;

    const appBarRight = <FlatButton label={polyglot.t('save')}
      onTouchTap={this.onTouchTapSave} className="testAccountEditSave" />;

    const self = this;

    // let avatarAdd = <Avatar icon={<IconAdd />} color="#000" backgroundColor="#fff" />;

    return <div>
        <CanvasHead>
          <AppBar title={polyglot.t('account_edit')} className="testAppBar"
            iconElementLeft={appBarLeft}
            iconElementRight={appBarRight} />
        </CanvasHead>
        <CanvasBody>
          <Paper rounded={false}>
            <ListItem disabled={true}>
              <TextField hintText={polyglot.t('account_name_hint')}
                defaultValue={accountUtils.getNameAccount(account)} fullWidth={true}
                onChange={this.onChangeName} style={styles.listItemBody} floatingLabelText={polyglot.t('name')}
                className="testAccountEditName" />
            </ListItem>
            {/*<ListItem disabled={true} leftIcon={<IconShare />}>
              <div style={_.extend({}, styles.listItemBody, styles.listItemPrimaryText)}>
                <ListItem>polyglot.t('account_add_shared')} rightToggle={
                    <Toggle defaultToggled={account.share} onToggle={this.onToggleShare} />
                  } />
              </div>
            }/>*/}
            <ListItem disabled={true} leftIcon={<IconPeople />}>
              <div>
                {polyglot.t('members')}
                {account.get('members').map(function(member) {
                  return <ListItem key={member.get('id')} disabled={true}
                    leftAvatar={<MemberAvatar member={member} />}>
                        <div>
                          {accountUtils.getNameMember(member)}
                          {account.get('share') &&
                            <TextField hintText={polyglot.t('email')}
                              defaultValue={member.get('email')} fullWidth={true}
                              onChange={self.onChangeEmail.bind(self, member.get('id'))} style={styles.listItemBody}
                              className="testAccountEditName" />
                          }
                        </div>
                      </ListItem>;
                })}
                {/*<ListItem leftAvatar={avatarAdd} onTouchTap={this.onTouchTapAdd}>
                  {polyglot.t('add_a_new_person')}
                }/>*/}
              </div>
            </ListItem>
          </Paper>
        </CanvasBody>
      </div>;
  },
});

module.exports = connect()(AccountAdd);
