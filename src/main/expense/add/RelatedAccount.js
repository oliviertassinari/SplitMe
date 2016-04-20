import React, {PropTypes, Component} from 'react';
import pure from 'recompose/pure';
import Immutable from 'immutable';
import TextField from 'material-ui-build/src/TextField';
import {connect} from 'react-redux';

import polyglot from 'polyglot';
import accountUtils from 'main/account/utils';
import screenActions from 'main/screen/actions';
import RelatedAccountDialog from 'main/expense/add/RelatedAccountDialog';
import MemberAvatars from 'main/member/Avatars';
import List from 'main/List';

const styles = {
  root: {
    width: '100%',
  },
};

class ExpenseRelatedAccount extends Component {
  static propTypes = {
    account: PropTypes.instanceOf(Immutable.Map).isRequired,
    accounts: PropTypes.instanceOf(Immutable.List).isRequired,
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
            withoutMargin={true}
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
          fullWidth={true}
          data-test="ExpenseAddRelatedAccount"
          style={textFieldStyle}
        />
      );
    }

    return (
      <div style={styles.root}>
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

export default pure(connect()(ExpenseRelatedAccount));
