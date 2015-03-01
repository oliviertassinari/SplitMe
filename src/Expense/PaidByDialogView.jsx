'use strict';

var React = require('react');
var _ = require('underscore');
var mui = require('material-ui');
var Dialog = mui.Dialog;
var RadioButton = mui.RadioButton;

var ListControl = require('../ListControl/View');

var PaidByDialogView = React.createClass({
  propTypes: {
    members: React.PropTypes.array.isRequired,
  },

  show: function() {
    this.refs.dialog.show();
  },

  onTouchTapListControl: function() {
    console.log('onTouchTapListControl');
  },

  render: function () {
    var self = this;

    return <Dialog title="Paid by" ref="dialog">
      {_.map(this.props.members, function (member) {
        return <ListControl
          onTouchTap={self.onTouchTapListControl}
          className="mui-menu-item"
          key={member.name}
          title={member.name} >
          <RadioButton value={member.name} />
        </ListControl>;
      })}
    </Dialog>;
  }
});

module.exports = PaidByDialogView;
