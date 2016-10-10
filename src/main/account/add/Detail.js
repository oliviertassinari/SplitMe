// @flow weak

import React, {PropTypes, Component} from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import {createStyleSheet} from 'stylishly/lib/styleSheet';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Paper from 'material-ui-build/src/Paper';
import TextField from 'material-ui-build/src/TextField';
import ListItem from 'material-ui-build/src/List/ListItem';
import IconPeople from 'material-ui-build/src/svg-icons/social/people';
import IconSync from 'material-ui-build/src/svg-icons/notification/sync';
import Toggle from 'material-ui-build/src/Toggle';
import {connect} from 'react-redux';
import config from 'config';
import polyglot from 'polyglot';
import accountUtils from 'main/account/utils';
import accountAddActions from 'main/account/add/actions';
import MemberAvatar from 'main/member/Avatar';
import MemberAdd from 'main/member/Add';

const styleSheet = createStyleSheet('AccountDetail', () => ({
  listItemNested: {
    margin: '-16px 0 0 -16px',
  },
}));

const styles = {
  listItemBody: {
    margin: '-16px 0 0',
  },
};

class AccountDetail extends Component {
  static propTypes = {
    account: ImmutablePropTypes.map.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  static contextTypes = {
    styleManager: PropTypes.object.isRequired,
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
    const classes = this.context.styleManager.render(styleSheet);
    const {
      account,
    } = this.props;

    return (
      <Paper rounded={false}>
        <ListItem disabled>
          <TextField
            hintText={polyglot.t('account_name_hint')}
            value={account.get('name')}
            fullWidth
            onChange={this.handleChangeName}
            style={styles.listItemBody}
            floatingLabelText={polyglot.t('name')}
            autoFocus={!account.get('_id')}
            data-test="AccountAddName"
          />
        </ListItem>
        <ListItem disabled leftIcon={<IconPeople />}>
          <div>
            {polyglot.t('members')}
            {account.get('members').map((member) => {
              return (
                <ListItem
                  key={member.get('id')}
                  disabled
                  leftAvatar={<MemberAvatar member={member} />}
                >
                  <div data-test="AccountAddMember">
                    {accountUtils.getNameMember(member)}
                  </div>
                  {account.get('share') && (
                    <TextField
                      hintText={polyglot.t('email')}
                      defaultValue={member.get('email')}
                      fullWidth
                      onChange={this.onChangeEmail.bind(this, member.get('id'))}
                    />
                  )}
                </ListItem>
              );
            })}
            <MemberAdd onAddMember={this.handleAddMember} />
          </div>
        </ListItem>
        {config.name !== 'production' && (
          <ListItem disabled leftIcon={<IconSync />}>
            <div className={classes.listItemNested}>
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

export default compose(
  pure,
  connect(),
)(AccountDetail);
