'use strict';

var React = require('react');
var _ = require('underscore');
var mui = require('material-ui');
var Dialog = mui.Dialog;
var RadioButton = mui.RadioButton;
var FontIcon = mui.FontIcon;

var List = require('../List/View');
var Avatar = require('../Avatar/View');

var PaidByDialogView = React.createClass({
  propTypes: {
    openImmediately: React.PropTypes.bool,
    members: React.PropTypes.array.isRequired,
    selected: React.PropTypes.object,
    onChange: React.PropTypes.func,
    onDismiss: React.PropTypes.func,
  },

  getInitialState: function() {
    return {
      selected: this.props.selected || {}
    };
  },

  show: function() {
    this.refs.dialog.show();
  },

  onNewSelected: function(event, newSelectedValue) {
    var newSelected = _.findWhere(this.props.members, {
      name: newSelectedValue
    });

    this.setState({
      selected: newSelected
    });

    if (this.props.onChange) {
      this.props.onChange(newSelected);
    }
  },

  onTouchTapAdd: function() {
    if ('production' === process.env.NODE_ENV) {
      var self = this;

      navigator.contacts.pickContact(function(contact) {
        console.log(contact);

        if (self.props.onChange) {
          self.props.onChange(contact);
        }
      }, function(error) {
        console.log(error);
      });
    }
  },

  render: function () {
    var self = this;

    var icon = <FontIcon className="md-add"/>;

    return <Dialog title="Paid by" ref="dialog" onDismiss={this.props.onDismiss}
      openImmediately={this.props.openImmediately}>
      {_.map(this.props.members, function (member) {
        var right = <RadioButton value={member.name} onCheck={self.onNewSelected}
                    checked={member.name === self.state.selected.name} />;

        var avatar = <Avatar name={member.name} />;

        return <List
          onTouchTap={self.onNewSelected.bind(self, '', member.name)}
          className="mui-menu-item"
          left={avatar}
          key={member.name}
          right={right}>
            {member.name}
        </List>;
      })}
      <List className="mui-menu-item" left={icon} onTouchTap={this.onTouchTapAdd}>
        Add a new one
      </List>
    </Dialog>;
  }
});

module.exports = PaidByDialogView;
