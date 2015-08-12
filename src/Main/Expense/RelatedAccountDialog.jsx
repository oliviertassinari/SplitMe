'use strict';

var React = require('react/addons');
var Immutable = require('immutable');
var Dialog = require('material-ui/lib/dialog');
var RadioButton = require('material-ui/lib/radio-button');
// var IconAdd = require('material-ui/lib/svg-icons/content/add');

var polyglot = require('polyglot');
var utils = require('utils');
var List = require('Main/List');
var MembersAvatar = require('Main/MembersAvatar');

var styles = {
  body: {
    padding: '16px 0 5px 0',
  },
  list: {
    maxHeight: 350,
    overflow: 'auto',
  },
};

var RelatedAccountDialog = React.createClass({
  propTypes: {
    accounts: React.PropTypes.instanceOf(Immutable.List).isRequired,
    onChange: React.PropTypes.func,
    onDismiss: React.PropTypes.func,
    selected: React.PropTypes.string,
  },
  mixins: [
    React.addons.PureRenderMixin,
  ],
  getInitialState: function() {
    return {
      selected: this.props.selected || '',
    };
  },
  componentWillReceiveProps: function(nextProps) {
    if (nextProps.hasOwnProperty('selected')) {
      this.setState({
        selected: nextProps.selected,
      });
    }
  },
  show: function() {
    this.refs.dialog.show();
  },
  dismiss: function() {
    this.refs.dialog.dismiss();
  },
  onTouchTap: function(newSelectedAccount) {
    this.setState({
      selected: newSelectedAccount.get('_id'),
    });

    this.props.onChange(newSelectedAccount);
  },
  onTouchTapAdd: function() {
  },
  render: function() {
    var self = this;
    var props = self.props;

    return <Dialog title={polyglot.t('expense_related_account')} ref="dialog"
        contentClassName="testExpenseAddRelatedAccountDialog"
        onDismiss={props.onDismiss} bodyStyle={styles.body}>
        <div style={styles.list}>
          {props.accounts.map(function(account) {
            var avatar = <MembersAvatar members={account.get('members')} />;
            var radioButton = <RadioButton value={account.get('_id')} checked={account.get('_id') === self.state.selected} />;

            return <List onTouchTap={self.onTouchTap.bind(self, account)}
                left={avatar} key={account.get('_id')} right={radioButton}>
                  {utils.getNameAccount(account)}
              </List>;
          })}
        </div>
        {/*<List left={<IconAdd />} onTouchTap={this.onTouchTapAdd}>
          {polyglot.t('add_a_new_account')}
        </List> */}
      </Dialog>;
  },
});

module.exports = RelatedAccountDialog;
