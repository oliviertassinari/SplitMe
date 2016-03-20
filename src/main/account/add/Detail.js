import React from 'react';
import pure from 'recompose/pure';
import Immutable from 'immutable';
import Paper from 'material-ui/src/paper';
import TextField from 'material-ui/src/text-field';
import ListItem from 'material-ui/src/lists/list-item';
import IconPeople from 'material-ui/src/svg-icons/social/people';
import IconSync from 'material-ui/src/svg-icons/notification/sync';
import Toggle from 'material-ui/src/toggle';
import {connect} from 'react-redux';

import config from 'config';
import polyglot from 'polyglot';
import accountUtils from 'main/account/utils';
import accountAddActions from 'main/account/add/actions';
import MemberAvatar from 'main/member/Avatar';
import MemberAdd from 'main/member/Add';

const styles = {
  listItemBody: {
    margin: '-16px 0 0',
  },
  listItemNested: {
    margin: '-16px 0 0 -16px',
  },
};

class AccountDetail extends React.Component {
  static propTypes = {
    account: React.PropTypes.instanceOf(Immutable.Map),
    dispatch: React.PropTypes.func.isRequired,
  };

  handleChangeName = (event) => {
    this.props.dispatch(accountAddActions.changeName(event.target.value));
  };

  handleAddMember = (member) => {
    this.props.dispatch(accountAddActions.addMember(member));
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
    } = this.props;

    if (!account) {
      return null;
    }

    return (
      <Paper rounded={false}>
        <ListItem disabled={true}>
          <TextField
            hintText={polyglot.t('account_name_hint')}
            value={account.get('name')}
            fullWidth={true}
            onChange={this.handleChangeName}
            style={styles.listItemBody}
            floatingLabelText={polyglot.t('name')}
            ref="name"
            data-test="AccountAddName"
          />
        </ListItem>
        <ListItem disabled={true} leftIcon={<IconPeople />}>
          <div>
            {polyglot.t('members')}
            {account.get('members').map((member) => {
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
        {config.name !== 'production' && (
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
    );
  }
}

function mapStateToProps(state) {
  return {
    account: state.getIn(['accountAdd', 'current']),
  };
}

export default pure(connect(mapStateToProps)(AccountDetail));
