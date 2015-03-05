'use strict';

var React = require('react');
var _ = require('underscore');
var mui = require('material-ui');
var Checkbox = mui.Checkbox;
var TextField = mui.TextField;
var FontIcon = mui.FontIcon;

var List = require('../List/View');

var action = require('./action');

var PaidForView = React.createClass({
  propTypes: {
    members: React.PropTypes.array.isRequired,
    paidFor: React.PropTypes.array.isRequired,
    split: React.PropTypes.string.isRequired,
    className: React.PropTypes.string,
  },

  onTouchTapAdd: function() {
    if ('production' === process.env.NODE_ENV) {
      navigator.contacts.pickContact(function(contact) {
        console.log(contact);
      }, function(error) {
        console.log(error);
      });
    }
  },

  onTouchTapEqualy: function(name, ref, event) {
    var element = this.refs[ref];

    if(event.target.name !== 'paidFor') {
      element.setChecked(!element.isChecked());
    }

    var paidForItem = _.findWhere(this.props.paidFor, { contactName: name });
    paidForItem.split_equaly = element.isChecked();

    action.changePaidFor(this.props.paidFor);
  },

  render: function() {
    var self = this;

    var paidForList = _.map(this.props.members, function (member) {
      var right;
      var className;
      var onTouchTap;

      var paidFor = _.findWhere(self.props.paidFor, { contactName: member.name });

      if(self.props.split === 'equaly') {
        right = <Checkbox label="" name="paidFor" ref={member.name + '_checkbox'} value={member.name} defaultSwitched={paidFor.split_equaly} />;
        className = 'mui-menu-item';
        onTouchTap = self.onTouchTapEqualy.bind(self, member.name, member.name + '_checkbox');
      } else {
        right = <TextField hintText="0.00" />;
      }

      return <List
        className={className}
        onTouchTap={onTouchTap}
        right={right}
        key={member.name}>
          {member.name}
      </List>;
    });

    var icon = <FontIcon className="md-add"/>;

    return <div className={this.props.className}>
      Split with
      {paidForList}
      <List className="mui-menu-item" left={icon} onTouchTap={this.onTouchTapAdd}>
        Add a new one
      </List>
    </div>;
  },
});

module.exports = PaidForView;
