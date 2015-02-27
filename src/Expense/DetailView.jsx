'use strict';

var React = require('react');
var mui = require('material-ui');
var Paper = mui.Paper;
var TextField = mui.TextField;
var DatePicker = mui.DatePicker;
var FontIcon = mui.FontIcon;

var DetailView = React.createClass({
  render: function () {
    var today = new Date();

    return <Paper zDepth={1} innerClassName="expense-detail" rounded={false}>
      <TextField hintText="Description" /><br />
      <div className="expense-detail-item">
        <FontIcon className="md-local-atm"/>
        <TextField hintText="0.00" type="number"/>
        €
      </div>
      <div className="expense-detail-item">
        <FontIcon className="md-schedule" />
        <DatePicker hintText="Date" defaultDate={today} />
      </div>
      <div className="expense-detail-item">
        <FontIcon className="md-person" />
      </div>
      <div className="expense-detail-item">
        <FontIcon className="md-people" />
      </div>
    </Paper>;
  }
});

module.exports = DetailView;
