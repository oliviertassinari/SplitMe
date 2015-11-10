'use strict';

const React = require('react');
const PureRenderMixin = require('react-addons-pure-render-mixin');
const Immutable = require('immutable');
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
const DocumentTitle = require('react-document-title');

const accountUtils = require('Main/Account/utils');
const polyglot = require('polyglot');
const pluginContacts = require('plugin/contacts');
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
  onBackButton() {
    this.props.dispatch(accountAddActions.navigateBack());
  },
  onTouchTapClose(event) {
    event.preventDefault();

    setTimeout(() => {
      this.props.dispatch(accountAddActions.close());
    }, 0);
  },
  onTouchTapSave(event) {
    event.preventDefault();

    setTimeout(() => {
      this.props.dispatch(accountAddActions.tapSave());
    }, 0);
  },
  onChangeName(event) {
    this.props.dispatch(accountAddActions.changeName(event.target.value));
  },
  onTouchTapAdd() {
    pluginContacts.pickContact().then(this.props.dispatch(accountAddActions.pickContact));
  },
  onToggleShare(event, toggle) {
    this.props.dispatch(accountAddActions.toggleShare(toggle));
  },
  onChangeEmail(memberId, event) {
    this.props.dispatch(accountAddActions.changeMemberEmail(event.target.value, memberId));
  },
  render() {
    const account = this.props.account;

    const appBarLeft = (
      <IconButton onTouchTap={this.onTouchTapClose}>
        <IconClose />
      </IconButton>
    );

    const appBarRight = (
      <FlatButton label={polyglot.t('save')}
        onTouchTap={this.onTouchTapSave} data-test="AccountAddSave" />
    );

    const self = this;

    // let avatarAdd = <Avatar icon={<IconAdd />} color="#000" backgroundColor="#fff" />;

    let title;

    if (account.get('_id')) {
      title = polyglot.t('account_edit');
    } else {
      title = polyglot.t('account_add_new');
    }

    return (
      <div>
        {PLATFORM === 'browser' && <DocumentTitle title={title} />}
        <CanvasHead>
          <AppBar title={title} data-test="AppBar"
            iconElementLeft={appBarLeft}
            iconElementRight={appBarRight} />
        </CanvasHead>
        <CanvasBody>
          <Paper rounded={false}>
            <ListItem disabled={true}>
              <TextField hintText={polyglot.t('account_name_hint')}
                defaultValue={accountUtils.getNameAccount(account)} fullWidth={true}
                onChange={this.onChangeName} style={styles.listItemBody} floatingLabelText={polyglot.t('name')}
                data-test="AccountAddName" />
            </ListItem>
            {/*<ListItem disabled={true} leftIcon={<IconShare />}>
              <div style={Object.assign({}, styles.listItemBody, styles.listItemPrimaryText)}>
                <ListItem>polyglot.t('account_add_shared')} rightToggle={
                    <Toggle defaultToggled={account.share} onToggle={this.onToggleShare} />
                  } />
              </div>
            }/>*/}
            <ListItem disabled={true} leftIcon={<IconPeople />}>
              <div>
                {polyglot.t('members')}
                {account.get('members').map((member) => {
                  return (
                    <ListItem key={member.get('id')} disabled={true}
                      leftAvatar={<MemberAvatar member={member} />}>
                      <div>
                        {accountUtils.getNameMember(member)}
                        {account.get('share') &&
                          <TextField hintText={polyglot.t('email')}
                            defaultValue={member.get('email')} fullWidth={true}
                            onChange={self.onChangeEmail.bind(self, member.get('id'))} style={styles.listItemBody}
                            data-test="AccountAddName" />
                        }
                      </div>
                    </ListItem>
                  );
                })}
                {/*<ListItem leftAvatar={avatarAdd} onTouchTap={this.onTouchTapAdd}>
                  {polyglot.t('add_a_new_person')}
                }/>*/}
              </div>
            </ListItem>
          </Paper>
        </CanvasBody>
      </div>
    );
  },
});

function mapStateToProps(state) {
  return {
    account: state.get('accountCurrent'),
  };
}

module.exports = connect(mapStateToProps)(AccountAdd);
