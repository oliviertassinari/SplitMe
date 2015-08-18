'use strict';

var React = require('react');
var Immutable = require('immutable');
var TextField = require('material-ui/lib/text-field');
var connect = require('react-redux').connect;

var polyglot = require('polyglot');
var utils = require('utils');
var screenActions = require('Main/Screen/actions');
var RelatedAccountDialog = require('Main/Expense/RelatedAccountDialog');
var MembersAvatar = require('Main/MembersAvatar');
var List = require('Main/List');

var styles = {
  root: {
    width: '100%',
  },
};

var RelatedAccount = React.createClass({
  propTypes: {
    account: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    accounts: React.PropTypes.instanceOf(Immutable.List).isRequired,
    dispatch: React.PropTypes.func.isRequired,
    onChange: React.PropTypes.func,
    pageDialog: React.PropTypes.string.isRequired,
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
        if (from === 'relatedAccount') {
          dialog.dismiss();
        }

        if (to === 'relatedAccount') {
          dialog.show();
        }
      });
    }
  },
  onFocus: function(event) {
    event.target.blur();
  },
  onTouchTap: function() {
    this.props.dispatch(screenActions.showDialog('relatedAccount'));
  },
  onDismiss: function() {
    this.props.dispatch(screenActions.dismissDialog());
  },
  render: function() {
    var props = this.props;
    var relatedAccount;

    if (props.account.get('_id')) {
      var avatar = <MembersAvatar members={props.account.get('members')} />;
      relatedAccount = <div>
          {polyglot.t('expense_related_account')}
          <List left={avatar} onTouchTap={this.onTouchTap} withoutMargin={true}>
            {utils.getNameAccount(props.account)}
          </List>
        </div>;
    } else {
      relatedAccount = <TextField hintText={polyglot.t('expense_related_account')} onTouchTap={this.onTouchTap}
        onFocus={this.onFocus} fullWidth={true} className="testExpenseAddRelatedAccount"
        style={props.textFieldStyle} />;
    }

    return <div style={styles.root}>
        {relatedAccount}
        <RelatedAccountDialog ref="dialog" accounts={props.accounts} selected={props.account.get('_id')}
          onChange={props.onChange} onDismiss={this.onDismiss} />
      </div>;
  },
});

module.exports = connect()(RelatedAccount);
