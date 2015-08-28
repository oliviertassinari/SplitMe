'use strict';

var React = require('react');
var Immutable = require('immutable');
var TextField = require('material-ui/lib/text-field');
var connect = require('react-redux').connect;

var polyglot = require('polyglot');
var utils = require('utils');
var screenActions = require('Main/Screen/actions');
var PaidByDialog = require('Main/Expense/PaidByDialog');
var MemberAvatar = require('Main/MemberAvatar');
var List = require('Main/List');

var styles = {
  root: {
    width: '100%',
  },
};

var PaidBy = React.createClass({
  propTypes: {
    account: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    dispatch: React.PropTypes.func.isRequired,
    onChange: React.PropTypes.func,
    onPickContact: React.PropTypes.func,
    pageDialog: React.PropTypes.string.isRequired,
    paidByContactId: React.PropTypes.string,
    textFieldStyle: React.PropTypes.object,
  },
  mixins: [
    React.addons.PureRenderMixin,
  ],
  componentWillUpdate: function(nextProps) {
    var from = this.props.pageDialog;
    var to = nextProps.pageDialog;

    if (from !== to) {
      var dialog = this.refs.dialog;

      // Prevent the dispatch inside a dispatch
      setTimeout(function() {
        if (from === 'paidBy') {
          dialog.dismiss();
        }

        if (to === 'paidBy') {
          dialog.show();
        }
      }, 0);
    }
  },
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
    var props = this.props;
    var paidBy;

    if (props.paidByContactId) {
      var paidByMember = utils.getAccountMember(props.account, props.paidByContactId)[1];

      var avatar = <MemberAvatar member={paidByMember} />;
      paidBy = <div>
          {polyglot.t('paid_by')}
          <List left={avatar} onTouchTap={this.onTouchTap} withoutMargin={true}>
            {utils.getNameMember(paidByMember)}
          </List>
        </div>;
    } else {
      paidBy = <TextField hintText={polyglot.t('paid_by')} onTouchTap={this.onTouchTap}
        onFocus={this.onFocus} fullWidth={true} className="testExpenseAddPaidBy"
        style={props.textFieldStyle} />;
    }

    return <div style={styles.root}>
        {paidBy}
        <PaidByDialog ref="dialog" members={props.account.get('members')}
          selected={props.paidByContactId} onChange={props.onChange} onPickContact={props.onPickContact}
          onDismiss={this.onDismiss} />
      </div>;
  },
});

module.exports = connect()(PaidBy);
