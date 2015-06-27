'use strict';

var React = require('react/addons');
var _ = require('underscore');
var Dialog = require('material-ui/lib/dialog');
var RadioButton = require('material-ui/lib/radio-button');
var IconAdd = require('material-ui/lib/svg-icons/content/add');

var polyglot = require('polyglot');
var contacts = require('contacts');
var utils = require('utils');
var List = require('Main/List');
var MembersAvatar = require('Main/MembersAvatar');
var action = require('./action');

var styles = {
  content: {
    padding: '16px 0 5px 0',
  },
};

var PaidByDialog = React.createClass({
  mixins: [
    React.addons.PureRenderMixin
  ],
  propTypes: {
    members: React.PropTypes.array.isRequired,
    selected: React.PropTypes.string,
    onChange: React.PropTypes.func,
    onDismiss: React.PropTypes.func,
  },
  getInitialState: function() {
    return {
      selected: this.props.selected || '',
    };
  },
  componentWillReceiveProps: function(nextProps) {
    if (nextProps.hasOwnProperty('selected')) {
      this.setState({
        selected: nextProps.selected
      });
    }
  },
  show: function() {
    this.refs.dialog.show();
  },
  dismiss: function() {
    this.refs.dialog.dismiss();
  },
  onTouchTap: function(newSelectedValue) {
    this.setState({
      selected: newSelectedValue
    });

    if (this.props.onChange) {
      var newSelected = _.findWhere(this.props.members, {
        id: newSelectedValue
      });

      this.props.onChange(newSelected);
    }
  },
  onTouchTapAdd: function() {
    var props = this.props;

    contacts.pickContact().then(function(contact) {
      action.pickContact(contact);
      props.onChange(contact);
    });
  },
  render: function () {
    var self = this;

    return <Dialog title={polyglot.t('paid_by')} ref="dialog" contentClassName="testExpenseAddPaidByDialog"
        onDismiss={this.props.onDismiss} contentInnerStyle={styles.content}>
        {_.map(this.props.members, function(member) {
          var avatar = <MembersAvatar member={member} />;
          var radioButton = <RadioButton value={member.id} checked={member.id === self.state.selected} />;

          return <List onTouchTap={self.onTouchTap.bind(self, member.id)}
              left={avatar} key={member.id} right={radioButton}>
                {utils.getDisplayName(member)}
            </List>;
        })}
        <List left={<IconAdd className="testExpenseAddPaidByDialogIcon" />} onTouchTap={this.onTouchTapAdd}>
          {polyglot.t('add_a_new_person')}
        </List>
      </Dialog>;
  },
});

module.exports = PaidByDialog;
