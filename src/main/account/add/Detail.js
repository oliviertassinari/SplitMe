import React, { Component } from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import { withStyles } from 'material-ui-next/styles';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Paper from 'material-ui-next/Paper';
import TextField from 'material-ui/TextField';
import ListItem from 'material-ui/List/ListItem';
import IconPeople from 'material-ui/svg-icons/social/people';
import IconSync from 'material-ui/svg-icons/notification/sync';
import Toggle from 'material-ui/Toggle';
import { connect } from 'react-redux';
import config from 'config';
import polyglot from 'polyglot';
import accountUtils from 'main/account/utils';
import accountAddActions from 'main/account/add/actions';
import MemberAvatar from 'main/member/Avatar';
import MemberAdd from 'main/member/Add';

const styles = {
  listItemNested: {
    margin: '-16px 0 0 -16px',
  },
};

const inlineStyles = {
  listItemBody: {
    margin: '-16px 0 0',
  },
};

class AccountDetail extends Component {
  static propTypes = {
    account: ImmutablePropTypes.map.isRequired,
    classes: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  handleChangeName = event => {
    this.props.dispatch(accountAddActions.changeName(event.target.value));
  };

  handleAddMember = member => {
    this.props.dispatch(accountAddActions.addMember(member));
  };

  handleToggleShare = (event, toggle) => {
    this.props.dispatch(accountAddActions.toggleShare(toggle));
  };

  onChangeEmail = memberId => event => {
    this.props.dispatch(accountAddActions.changeMemberEmail(event.target.value, memberId));
  };

  render() {
    const { account, classes } = this.props;

    return (
      <Paper square>
        <ListItem disabled>
          <TextField
            hintText={polyglot.t('account_name_hint')}
            value={account.get('name')}
            fullWidth
            onChange={this.handleChangeName}
            style={inlineStyles.listItemBody}
            floatingLabelText={polyglot.t('name')}
            autoFocus={!account.get('_id')}
            data-test="AccountAddName"
          />
        </ListItem>
        <ListItem disabled leftIcon={<IconPeople />}>
          <div>
            {polyglot.t('members')}
            {account.get('members').map(member => {
              return (
                <ListItem
                  key={member.get('id')}
                  disabled
                  leftAvatar={<MemberAvatar member={member} />}
                >
                  <div data-test="AccountAddMember">{accountUtils.getNameMember(member)}</div>
                  {account.get('share') && (
                    <TextField
                      hintText={polyglot.t('email')}
                      defaultValue={member.get('email')}
                      fullWidth
                      onChange={this.onChangeEmail(member.get('id'))}
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

export default compose(pure, withStyles(styles), connect())(AccountDetail);
