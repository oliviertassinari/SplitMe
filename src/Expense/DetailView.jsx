'use strict';

var React = require('react');
var mui = require('material-ui');
var Paper = mui.Paper;
var TextField = mui.TextField;
var DatePicker = mui.DatePicker;

var DetailView = React.createClass({
  render: function () {
    var today = new Date();

    return <Paper zDepth={1} className="expense-detail" rounded={false}>
      <TextField hintText="Description" /><br />
      <TextField hintText="0.00" />
      <DatePicker hintText="Date" defaultDate={today} />
    </Paper>;
  }
});

module.exports = DetailView;
