// @flow weak

import React, { PropTypes, Component } from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import { createStyleSheet } from 'jss-theme-reactor';
import ImmutablePropTypes from 'react-immutable-proptypes';
import TextField from 'material-ui-build/src/TextField';
import { connect } from 'react-redux';
import polyglot from 'polyglot';
import withStyles from 'material-ui-build-next/src/styles/withStyles';
import List from 'modules/components/List';
import accountUtils from 'main/account/utils';
import screenActions from 'main/screen/actions';
import RelatedAccountDialog from 'main/expense/add/RelatedAccountDialog';
import MemberAvatars from 'main/member/Avatars';

const styleSheet = createStyleSheet('ExpenseRelatedAccount', () => ({
  root: {
    width: '100%',
  },
}));

class ExpenseRelatedAccount extends Component {
  static propTypes = {
    account: ImmutablePropTypes.map.isRequired,
    accounts: ImmutablePropTypes.list.isRequired,
    classes: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    openDialog: PropTypes.bool.isRequired,
    textFieldStyle: PropTypes.object,
  };

  handleFocus = (event) => {
    event.target.blur();
  };

  handleTouchTap = () => {
    this.props.dispatch(screenActions.showDialog('relatedAccount'));
  };

  handleRequestClose = () => {
    this.props.dispatch(screenActions.dismissDialog());
  };

  render() {
    const {
      account,
      accounts,
      classes,
      onChange,
      openDialog,
      textFieldStyle,
    } = this.props;

    let relatedAccount;

    if (account.get('_id')) {
      relatedAccount = (
        <div>
          {polyglot.t('expense_related_account')}
          <List
            left={<MemberAvatars members={account.get('members')} />}
            onTouchTap={this.handleTouchTap}
            withoutMargin
          >
            {accountUtils.getNameAccount(account)}
          </List>
        </div>
      );
    } else {
      relatedAccount = (
        <TextField
          hintText={polyglot.t('expense_related_account')}
          onTouchTap={this.handleTouchTap}
          onFocus={this.handleFocus}
          fullWidth
          data-test="ExpenseAddRelatedAccount"
          style={textFieldStyle}
        />
      );
    }

    return (
      <div className={classes.root}>
        {relatedAccount}
        <RelatedAccountDialog
          accounts={accounts}
          selected={account.get('_id')}
          onChange={onChange}
          onRequestClose={this.handleRequestClose}
          open={openDialog}
        />
      </div>
    );
  }
}

export default compose(
  pure,
  withStyles(styleSheet),
  connect(),
)(ExpenseRelatedAccount);
