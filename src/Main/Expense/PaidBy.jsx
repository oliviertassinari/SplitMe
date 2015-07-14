'use strict';

var React = require('react');
var TextField = require('material-ui/lib/text-field');

var polyglot = require('polyglot');
var utils = require('utils');
var pageAction = require('Main/pageAction');
var PaidByDialog = require('./PaidByDialog');
var MembersAvatar = require('Main/MembersAvatar');
var List = require('Main/List');

var styles = {
  root: {
    width: '100%',
  },
};

var PaidBy = React.createClass({
  propTypes: {
    account: React.PropTypes.object.isRequired,
    pageDialog: React.PropTypes.string.isRequired,
    paidByContactId: React.PropTypes.string,
    onChange: React.PropTypes.func,
    textFieldStyle: React.PropTypes.object,
  },
  componentWillUpdate: function(nextProps) {
    var from = this.props.pageDialog;
    var to = nextProps.pageDialog;

    if(from !== to) {
      var dialog = this.refs.dialog;

      // Prevent the dispatch inside a dispatch
      setTimeout(function() {
        if(from === 'paidBy') {
          dialog.dismiss();
        }

        if(to === 'paidBy') {
          dialog.show();
        }
      });
    }
  },
  onFocus: function(event) {
    event.target.blur();
  },
  onTouchTap: function() {
    pageAction.showDialog('paidBy');
  },
  onDismiss: function() {
    pageAction.dismissDialog();
  },
  render: function() {
    var props = this.props;
    var paidBy;

    if(props.paidByContactId) {
      var paidByMember = utils.getAccountMember(props.account, props.paidByContactId);

      var avatar = <MembersAvatar member={paidByMember} />;
      paidBy = <div>
          {polyglot.t('paid_by')}
          <List left={avatar} onTouchTap={this.onTouchTap} withoutMargin={true}>
            {utils.getDisplayNameMember(paidByMember)}
          </List>
        </div>;
    } else {
      paidBy = <TextField hintText={polyglot.t('paid_by')} onTouchTap={this.onTouchTap}
        onFocus={this.onFocus} fullWidth={true} className="testExpenseAddPaidBy"
        style={props.textFieldStyle} />;
    }

    return <div style={styles.root}>
        {paidBy}
        <PaidByDialog ref="dialog" members={props.account.members}
          selected={props.paidByContactId} onChange={props.onChange}
          onDismiss={this.onDismiss} />
      </div>;
  },
});

module.exports = PaidBy;
