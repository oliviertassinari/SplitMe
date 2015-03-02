'use strict';

var React = require('react');
var _ = require('underscore');
var mui = require('material-ui');
var Dialog = mui.Dialog;
var RadioButton = mui.RadioButton;
var FontIcon = mui.FontIcon;

var List = require('../List/View');

var action = require('./action');

var PaidByDialogView = React.createClass({
  propTypes: {
    members: React.PropTypes.array.isRequired,
    defaultSelected: React.PropTypes.array,
  },

  getInitialState: function() {
    return {
      selected: this.props.defaultSelected || ''
    };
  },

  show: function() {
    this.refs.dialog.show();
  },

  onNewSelected: function(event, newSelected) {
    this.setState({
      selected: newSelected
    });

    this.refs.dialog.dismiss();
  },

  onTouchTapAdd: function() {
    if ('production' === process.env.NODE_ENV) {
      var self = this;

      navigator.contacts.pickContact(function(contact) {
        console.log(contact);
        self.refs.dialog.dismiss();
      }, function(error) {
        console.log(error);
      });
    }
  },

  render: function () {
    var self = this;

    var icon = <FontIcon className="md-add"/>;

    return <Dialog title="Paid by" ref="dialog">
      {_.map(this.props.members, function (member) {
        var right = <RadioButton value={member.name} refs={member.name} onCheck={self.onNewSelected}
                    checked={member.name === self.state.selected} />;

        return <List
          onTouchTap={self.onNewSelected.bind(self, '', member.name)}
          className="mui-menu-item"
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
