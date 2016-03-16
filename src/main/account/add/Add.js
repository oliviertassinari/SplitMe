import React from 'react';
import pure from 'recompose/pure';
import Immutable from 'immutable';
import AppBar from 'material-ui/src/app-bar';
import EventListener from 'react-event-listener';
import Paper from 'material-ui/src/paper';
import TextField from 'material-ui/src/text-field';
import ListItem from 'material-ui/src/lists/list-item';
import IconButton from 'material-ui/src/icon-button';
import IconClose from 'material-ui/src/svg-icons/navigation/close';
import IconPeople from 'material-ui/src/svg-icons/social/people';
import FlatButton from 'material-ui/src/flat-button';
import IconSync from 'material-ui/src/svg-icons/notification/sync';
import Toggle from 'material-ui/src/toggle';
import {connect} from 'react-redux';
import DocumentTitle from 'react-document-title';

import config from 'config';
import polyglot from 'polyglot';
import accountUtils from 'main/account/utils';
import CanvasHead from 'main/canvas/Head';
import CanvasBody from 'main/canvas/Body';
import accountAddActions from 'main/account/add/actions';
import MemberAvatar from 'main/member/Avatar';
import MemberAdd from 'main/member/Add';
import expenseActions from 'main/expense/actions';

const styles = {
  listItemBody: {
    margin: '-16px 0 0',
  },
  listItemNested: {
    margin: '-16px 0 0 -16px',
  },
};

class AccountAdd extends React.Component {
  static propTypes = {
    account: React.PropTypes.instanceOf(Immutable.Map),
    dispatch: React.PropTypes.func.isRequired,
    routeParams: React.PropTypes.shape({
      id: React.PropTypes.string,
    }).isRequired,
  };

  componentDidMount() {
    const {
      dispatch,
      account,
      routeParams,
    } = this.props;

    dispatch(accountAddActions.fetchAdd(routeParams.id));

    if (account && !account.get('_id')) { // Not a new account
      setTimeout(() => {
        this.refs.name.focus();

        if (process.env.PLATFORM === 'android') {
          cordova.plugins.Keyboard.show();
        }
      }, 0);
    }
  }

  handleBackButton = () => {
    this.props.dispatch(accountAddActions.navigateBack(this.props.routeParams.id));
  };

  handleTouchTapClose = () => {
    setTimeout(() => {
      this.props.dispatch(accountAddActions.close(this.props.routeParams.id));
    }, 0);
  };

  handleTouchTapSave = () => {
    setTimeout(() => {
      this.props.dispatch(accountAddActions.tapSave(this.props.routeParams.id));
    }, 0);
  };

  handleChangeName = (event) => {
    this.props.dispatch(accountAddActions.changeName(event.target.value));
  };

  handleAddMember = (member) => {
    this.props.dispatch(expenseActions.addMember(member, false, false));
  };

  handleToggleShare = (event, toggle) => {
    this.props.dispatch(accountAddActions.toggleShare(toggle));
  };

  onChangeEmail = (memberId, event) => {
    this.props.dispatch(accountAddActions.changeMemberEmail(event.target.value, memberId));
  };

  render() {
    const {
      account,
      routeParams,
    } = this.props;

    const appBarLeft = (
      <IconButton onTouchTap={this.handleTouchTapClose}>
        <IconClose />
      </IconButton>
    );

    const appBarRight = (
      <FlatButton
        label={polyglot.t('save')}
        onTouchTap={this.handleTouchTapSave}
        data-test="AccountAddSave"
      />
    );

    const self = this;

    let title;

    if (routeParams.id) {
      title = polyglot.t('account_edit');
    } else {
      title = polyglot.t('account_add_new');
    }

    return (
      <div>
        {(process.env.PLATFORM === 'browser' || process.env.PLATFORM === 'server') &&
          <DocumentTitle title={title} />
        }
        <EventListener elementName="document" onBackButton={this.handleBackButton} />
        <CanvasHead>
          <AppBar
            title={title} data-test="AppBar"
            iconElementLeft={appBarLeft} iconElementRight={appBarRight}
          />
        </CanvasHead>
        <CanvasBody>
          <Paper rounded={false}>
            <ListItem disabled={true}>
              <TextField
                hintText={polyglot.t('account_name_hint')}
                value={accountUtils.getNameAccount(account)}
                fullWidth={true}
                onChange={this.handleChangeName}
                style={styles.listItemBody}
                floatingLabelText={polyglot.t('name')}
                data-test="AccountAddName"
                ref="name"
              />
            </ListItem>
            <ListItem disabled={true} leftIcon={<IconPeople />}>
              <div>
                {polyglot.t('members')}
                {account && account.get('members').map((member) => {
                  return (
                    <ListItem
                      key={member.get('id')} disabled={true}
                      leftAvatar={<MemberAvatar member={member} />}
                    >
                      <div data-test="AccountAddMember">
                        {accountUtils.getNameMember(member)}
                      </div>
                      {account.get('share') &&
                        <TextField
                          hintText={polyglot.t('email')}
                          defaultValue={member.get('email')}
                          fullWidth={true}
                          onChange={self.onChangeEmail.bind(self, member.get('id'))}
                        />
                      }
                    </ListItem>
                  );
                })}
                <MemberAdd onAddMember={this.handleAddMember} />
              </div>
            </ListItem>
            {account && config.name !== 'production' && (
              <ListItem disabled={true} leftIcon={<IconSync />}>
                <div style={styles.listItemNested}>
                  <ListItem
                    primaryText={polyglot.t('account_add_shared')}
                    rightToggle={
                      <Toggle defaultToggled={account.get('share')} onToggle={this.handleToggleShare} />
                    }
                  />
                </div>
              </ListItem>
            )}
          </Paper>
        </CanvasBody>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    account: state.get('accountCurrent'),
  };
}

export default pure(connect(mapStateToProps)(AccountAdd));
