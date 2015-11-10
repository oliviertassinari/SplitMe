import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Immutable from 'immutable';
import TextField from 'material-ui/lib/text-field';
import {connect} from 'react-redux';

import polyglot from 'polyglot';
import accountUtils from 'Main/Account/utils';
import screenActions from 'Main/Screen/actions';
import RelatedAccountDialog from 'Main/Expense/RelatedAccountDialog';
import MembersAvatar from 'Main/MembersAvatar';
import List from 'Main/List';

const styles = {
  root: {
    width: '100%',
  },
};

const RelatedAccount = React.createClass({
  propTypes: {
    account: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    accounts: React.PropTypes.instanceOf(Immutable.List).isRequired,
    dispatch: React.PropTypes.func.isRequired,
    onChange: React.PropTypes.func,
    openDialog: React.PropTypes.bool.isRequired,
    textFieldStyle: React.PropTypes.object,
  },
  mixins: [
    PureRenderMixin,
  ],
  onFocus(event) {
    event.target.blur();
  },
  onTouchTap() {
    this.props.dispatch(screenActions.showDialog('relatedAccount'));
  },
  onRequestClose() {
    this.props.dispatch(screenActions.dismissDialog());
  },
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
      const avatar = <MembersAvatar members={account.get('members')} />;
      relatedAccount = (
        <div>
          {polyglot.t('expense_related_account')}
          <List left={avatar} onTouchTap={this.onTouchTap} withoutMargin={true}>
            {accountUtils.getNameAccount(account)}
          </List>
        </div>
      );
    } else {
      relatedAccount = (
        <TextField hintText={polyglot.t('expense_related_account')} onTouchTap={this.onTouchTap}
          onFocus={this.onFocus} fullWidth={true} data-test="ExpenseAddRelatedAccount"
          style={textFieldStyle} />
      );
    }

    return (
      <div style={styles.root}>
        {relatedAccount}
        <RelatedAccountDialog accounts={accounts} selected={account.get('_id')}
          onChange={onChange} onRequestClose={this.onRequestClose} open={openDialog} />
      </div>
    );
  },
});

export default connect()(RelatedAccount);
