'use strict';

const React = require('react');
const Immutable = require('immutable');
const TextField = require('material-ui/lib/text-field');
const {connect} = require('react-redux');

const polyglot = require('polyglot');
const accountUtils = require('Main/Account/utils');
const screenActions = require('Main/Screen/actions');
const PaidByDialog = require('Main/Expense/PaidByDialog');
const MemberAvatar = require('Main/MemberAvatar');
const List = require('Main/List');
const CanvasDialog = require('Main/Canvas/Dialog');

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
    React.addons.PureRenderMixin,
  ],
  onFocus: function(event) {
    event.target.blur();
  },
  onTouchTap: function() {
    this.props.dispatch(screenActions.showDialog('paidBy'));
  },
  onDismiss: function() {
    this.props.dispatch(screenActions.dismissDialog());
  },
  render: function() {
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
      paidBy = <div>
          {polyglot.t('paid_by')}
          <List left={avatar} onTouchTap={this.onTouchTap} withoutMargin={true}>
            {accountUtils.getNameMember(paidByMember)}
          </List>
        </div>;
    } else {
      paidBy = <TextField hintText={polyglot.t('paid_by')} onTouchTap={this.onTouchTap}
        onFocus={this.onFocus} fullWidth={true} className="testExpenseAddPaidBy"
        style={textFieldStyle} />;
    }

    return <div style={styles.root}>
        {paidBy}
        <CanvasDialog show={showDialog}>
          <PaidByDialog members={account.get('members')}
            selected={paidByContactId} onChange={onChange} onPickContact={onPickContact}
            onDismiss={this.onDismiss} />
        </CanvasDialog>
      </div>;
  },
});

module.exports = connect()(PaidBy);
