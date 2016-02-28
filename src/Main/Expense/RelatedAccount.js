import React from 'react';
import pure from 'recompose/pure';
import Immutable from 'immutable';
import TextField from 'material-ui/src/text-field';
import {connect} from 'react-redux';

import polyglot from 'polyglot';
import accountUtils from 'Main/Account/utils';
import screenActions from 'Main/Screen/actions';
import RelatedAccountDialog from 'Main/Expense/RelatedAccountDialog';
import MemberAvatars from 'Main/Member/Avatars';
import List from 'Main/List';

const styles = {
  root: {
    width: '100%',
  },
};

class ExpenseRelatedAccount extends React.Component {
  static propTypes = {
    account: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    accounts: React.PropTypes.instanceOf(Immutable.List).isRequired,
    dispatch: React.PropTypes.func.isRequired,
    onChange: React.PropTypes.func,
    openDialog: React.PropTypes.bool.isRequired,
    textFieldStyle: React.PropTypes.object,
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
            onTouchTap={this.handleTouchTap} withoutMargin={true}
          >
            {accountUtils.getNameAccount(account)}
          </List>
        </div>
      );
    } else {
      relatedAccount = (
        <TextField
          hintText={polyglot.t('expense_related_account')} onTouchTap={this.handleTouchTap}
          onFocus={this.handleFocus} fullWidth={true} data-test="ExpenseAddRelatedAccount"
          style={textFieldStyle}
        />
      );
    }

    return (
      <div style={styles.root}>
        {relatedAccount}
        <RelatedAccountDialog
          accounts={accounts} selected={account.get('_id')}
          onChange={onChange} onRequestClose={this.handleRequestClose} open={openDialog}
        />
      </div>
    );
  }
}

export default pure(connect()(ExpenseRelatedAccount));
