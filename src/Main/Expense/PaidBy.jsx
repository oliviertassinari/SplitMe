import React from 'react';
import pure from 'recompose/pure';
import Immutable from 'immutable';
import TextField from 'material-ui/src/text-field';
import {connect} from 'react-redux';

import polyglot from 'polyglot';
import accountUtils from 'Main/Account/utils';
import screenActions from 'Main/Screen/actions';
import ExpensePaidByDialog from 'Main/Expense/PaidByDialog';
import MemberAvatar from 'Main/Member/Avatar';
import List from 'Main/List';

const styles = {
  root: {
    width: '100%',
  },
};

class ExpensePaidBy extends React.Component {
  static propTypes = {
    account: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    dispatch: React.PropTypes.func.isRequired,
    onAddMember: React.PropTypes.func,
    onChange: React.PropTypes.func,
    openDialog: React.PropTypes.bool.isRequired,
    paidByContactId: React.PropTypes.string,
    textFieldStyle: React.PropTypes.object,
  };

  handleFocus = (event) => {
    event.target.blur();
  };

  handleTouchTap = () => {
    this.props.dispatch(screenActions.showDialog('paidBy'));
  };

  handleRequestClose = () => {
    this.props.dispatch(screenActions.dismissDialog());
  };

  render() {
    const {
      account,
      onAddMember,
      onChange,
      paidByContactId,
      openDialog,
      textFieldStyle,
    } = this.props;

    let paidBy;

    if (paidByContactId) {
      const paidByMember = accountUtils.getAccountMember(account, paidByContactId)[1];

      paidBy = (
        <div>
          {polyglot.t('paid_by')}
          <List
            left={<MemberAvatar member={paidByMember} />}
            onTouchTap={this.handleTouchTap} withoutMargin={true}
          >
            {accountUtils.getNameMember(paidByMember)}
          </List>
        </div>
      );
    } else {
      paidBy = (
        <TextField
          hintText={polyglot.t('paid_by')} onTouchTap={this.handleTouchTap}
          onFocus={this.handleFocus} fullWidth={true} data-test="ExpenseAddPaidBy"
          style={textFieldStyle}
        />
      );
    }

    return (
      <div style={styles.root}>
        {paidBy}
        <ExpensePaidByDialog
          members={account.get('members')} open={openDialog}
          selected={paidByContactId} onChange={onChange} onAddMember={onAddMember}
          onRequestClose={this.handleRequestClose}
        />
      </div>
    );
  }
}

export default connect()(pure(ExpensePaidBy));
