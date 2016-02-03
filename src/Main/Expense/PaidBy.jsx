import React from 'react';
import pure from 'recompose/pure';
import Immutable from 'immutable';
import TextField from 'material-ui/src/text-field';
import {connect} from 'react-redux';

import polyglot from 'polyglot';
import accountUtils from 'Main/Account/utils';
import screenActions from 'Main/Screen/actions';
import PaidByDialog from 'Main/Expense/PaidByDialog';
import MemberAvatar from 'Main/MemberAvatar';
import List from 'Main/List';

const styles = {
  root: {
    width: '100%',
  },
};

class PaidBy extends React.Component {
  static propTypes = {
    account: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    dispatch: React.PropTypes.func.isRequired,
    onChange: React.PropTypes.func,
    onPickContact: React.PropTypes.func,
    openDialog: React.PropTypes.bool.isRequired,
    paidByContactId: React.PropTypes.string,
    textFieldStyle: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.handleTouchTap = this.handleTouchTap.bind(this);
  }

  handleFocus(event) {
    event.target.blur();
  }

  handleTouchTap() {
    this.props.dispatch(screenActions.showDialog('paidBy'));
  }

  handleRequestClose() {
    this.props.dispatch(screenActions.dismissDialog());
  }

  render() {
    const {
      account,
      onChange,
      onPickContact,
      paidByContactId,
      openDialog,
      textFieldStyle,
    } = this.props;
    let paidBy;

    if (paidByContactId) {
      const paidByMember = accountUtils.getAccountMember(account, paidByContactId)[1];

      const avatar = <MemberAvatar member={paidByMember} />;
      paidBy = (
        <div>
          {polyglot.t('paid_by')}
          <List left={avatar} onTouchTap={this.handleTouchTap} withoutMargin={true}>
            {accountUtils.getNameMember(paidByMember)}
          </List>
        </div>
      );
    } else {
      paidBy = (
        <TextField hintText={polyglot.t('paid_by')} onTouchTap={this.handleTouchTap}
          onFocus={this.handleFocus} fullWidth={true} data-test="ExpenseAddPaidBy"
          style={textFieldStyle}
        />
      );
    }

    return (
      <div style={styles.root}>
        {paidBy}
        <PaidByDialog members={account.get('members')} open={openDialog}
          selected={paidByContactId} onChange={onChange} onPickContact={onPickContact}
          onRequestClose={this.handleRequestClose}
        />
      </div>
    );
  }
}

export default connect()(pure(PaidBy));
