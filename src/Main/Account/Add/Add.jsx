import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Immutable from 'immutable';
import AppBar from 'material-ui/lib/app-bar';
import EventListener from 'react-event-listener';
import Paper from 'material-ui/lib/paper';
import TextField from 'material-ui/lib/text-field';
import ListItem from 'material-ui/lib/lists/list-item';
import IconButton from 'material-ui/lib/icon-button';
import IconClose from 'material-ui/lib/svg-icons/navigation/close';
// let IconShare = require('material-ui/lib/svg-icons/social/share');
import IconPeople from 'material-ui/lib/svg-icons/social/people';
import FlatButton from 'material-ui/lib/flat-button';
// let Toggle = require('material-ui/lib/toggle');
// import IconAdd from 'material-ui/lib/svg-icons/content/add';
// let Avatar = require('material-ui/lib/avatar');
import {connect} from 'react-redux';
import DocumentTitle from 'react-document-title';

import accountUtils from 'Main/Account/utils';
import polyglot from 'polyglot';
import pluginContacts from 'plugin/contacts';
import CanvasHead from 'Main/Canvas/Head';
import CanvasBody from 'Main/Canvas/Body';
import accountAddActions from 'Main/Account/Add/actions';
import MemberAvatar from 'Main/MemberAvatar';

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
  componentDidMount() {
    if (!this.props.account.get('_id')) { // Not a new account
      setTimeout(() => {
        this.refs.name.focus();

        if (process.env.PLATFORM === 'android') {
          cordova.plugins.Keyboard.show();
        }
      }, 0);
    }
  },
  listeners: {
    document: {
      backbutton: 'handleBackButton',
    },
  },
  handleBackButton() {
    this.props.dispatch(accountAddActions.navigateBack());
  },
  handleTouchTapClose(event) {
    event.preventDefault();

    setTimeout(() => {
      this.props.dispatch(accountAddActions.close());
    }, 0);
  },
  handleTouchTapSave(event) {
    event.preventDefault();

    setTimeout(() => {
      this.props.dispatch(accountAddActions.tapSave());
    }, 0);
  },
  handleChangeName(event) {
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
      <IconButton onTouchTap={this.handleTouchTapClose}>
        <IconClose />
      </IconButton>
    );

    const appBarRight = (
      <FlatButton label={polyglot.t('save')}
        onTouchTap={this.handleTouchTapSave} data-test="AccountAddSave" />
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
        {process.env.PLATFORM === 'browser' && <DocumentTitle title={title} />}
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
                onChange={this.handleChangeName} style={styles.listItemBody} floatingLabelText={polyglot.t('name')}
                data-test="AccountAddName" ref="name" />
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

export default connect(mapStateToProps)(AccountAdd);
