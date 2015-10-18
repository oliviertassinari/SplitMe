'use strict';

const React = require('react');
const PureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');
const Immutable = require('immutable');
const TextField = require('material-ui/src/text-field');
const {connect} = require('react-redux');

const polyglot = require('polyglot');
const accountUtils = require('Main/Account/utils');
const screenActions = require('Main/Screen/actions');
const RelatedAccountDialog = require('Main/Expense/RelatedAccountDialog');
const MembersAvatar = require('Main/MembersAvatar');
const List = require('Main/List');
const CanvasDialog = require('Main/Canvas/Dialog');

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
    this.props.dispatch(screenActions.showDialog('relatedAccount'));
  },
  onDismiss() {
    if (this.props.showDialog) {
      this.props.dispatch(screenActions.dismissDialog());
    }
  },
  render() {
    const {
      account,
      accounts,
      onChange,
      showDialog,
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
        <CanvasDialog show={showDialog}>
          <RelatedAccountDialog accounts={accounts} selected={account.get('_id')}
            onChange={onChange} onDismiss={this.onDismiss} />
        </CanvasDialog>
      </div>
    );
  },
});

module.exports = connect()(RelatedAccount);
