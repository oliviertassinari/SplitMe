'use strict';

var React = require('react');
var _ = require('underscore');
var mui = require('material-ui');
var Dialog = mui.Dialog;
var RadioButton = mui.RadioButton;
var FontIcon = mui.FontIcon;

var List = require('../List/View');
var Avatar = require('../Avatar/View');
var action = require('./action');

var PaidByDialogView = React.createClass({
  propTypes: {
    open: React.PropTypes.bool,
    members: React.PropTypes.array.isRequired,
    selected: React.PropTypes.object,
    onChange: React.PropTypes.func,
    onDismiss: React.PropTypes.func,
  },

  getInitialState: function() {
    return {
      selected: this.props.selected || {},
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

  onNewSelected: function(event, newSelectedValue) {
    var newSelected = _.findWhere(this.props.members, {
      id: newSelectedValue
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
        action.pickContact(contact);
        self.props.onChange(contact);
      }, function(error) {
        console.log(error);
      });
    } else {
      var contact = {
        id: '101',
        displayName: 'My name',
      };
      action.pickContact(contact);
      this.props.onChange(contact);
    }
  },

  render: function () {
    var self = this;
    var icon = <FontIcon className="md-add"/>;

    return <Dialog title="Paid by" ref="dialog" onDismiss={this.props.onDismiss}
      open={this.props.open}>
      {_.map(this.props.members, function (member) {
        var right = <RadioButton value={member.id} onCheck={self.onNewSelected}
                    checked={member.id === self.state.selected.id} />;

        var avatar = <Avatar contacts={[member]} />;

        return <List
          onTouchTap={self.onNewSelected.bind(self, '', member.id)}
          className="mui-menu-item"
          left={avatar}
          key={member.id}
          right={right}>
            {member.displayName}
        </List>;
      })}
      <List className="mui-menu-item" left={icon} onTouchTap={this.onTouchTapAdd}>
        Add a new one
      </List>
    </Dialog>;
  }
});

module.exports = PaidByDialogView;
