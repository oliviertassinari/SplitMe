import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Immutable from 'immutable';
import TextField from 'material-ui/lib/text-field';
import {connect} from 'react-redux';

import polyglot from 'polyglot';
import accountUtils from 'Main/Account/utils';
import screenActions from 'Main/Screen/actions';
import PaidByDialog from 'Main/Expense/PaidByDialog';
import MemberAvatar from 'Main/MemberAvatar';
import List from 'Main/List';
import CanvasDialog from 'Main/Canvas/Dialog';

const styles = {
  root: {
    width: '100%',
  },
};

const PaidBy = React.createClass({
  propTypes: {
    account: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    dispatch: React.PropTypes.func.isRequired,
    onChange: React.PropTypes.func,
    onPickContact: React.PropTypes.func,
    paidByContactId: React.PropTypes.string,
    showDialog: React.PropTypes.bool.isRequired,
    textFieldStyle: React.PropTypes.object,
  },
  mixins: [
    PureRenderMixin,
  ],
  onFocus(event) {
    event.target.blur();
  },
  onTouchTap() {
    this.props.dispatch(screenActions.showDialog('paidBy'));
  },
  onDismiss() {
    if (this.props.showDialog) {
      this.props.dispatch(screenActions.dismissDialog());
    }
  },
  render() {
    const {
      account,
      onChange,
      onPickContact,
      paidByContactId,
      showDialog,
      textFieldStyle,
    } = this.props;
    let paidBy;

    if (paidByContactId) {
      const paidByMember = accountUtils.getAccountMember(account, paidByContactId)[1];

      const avatar = <MemberAvatar member={paidByMember} />;
      paidBy = (
        <div>
          {polyglot.t('paid_by')}
          <List left={avatar} onTouchTap={this.onTouchTap} withoutMargin={true}>
            {accountUtils.getNameMember(paidByMember)}
          </List>
        </div>
      );
    } else {
      paidBy = (
        <TextField hintText={polyglot.t('paid_by')} onTouchTap={this.onTouchTap}
          onFocus={this.onFocus} fullWidth={true} data-test="ExpenseAddPaidBy"
          style={textFieldStyle} />
      );
    }

    return (
      <div style={styles.root}>
        {paidBy}
        <CanvasDialog show={showDialog}>
          <PaidByDialog members={account.get('members')}
            selected={paidByContactId} onChange={onChange} onPickContact={onPickContact}
            onDismiss={this.onDismiss} />
        </CanvasDialog>
      </div>
    );
  },
});

export default connect()(PaidBy);
