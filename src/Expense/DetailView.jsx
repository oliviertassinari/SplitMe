'use strict';

var React = require('react');
var mui = require('material-ui');
var Paper = mui.Paper;
var TextField = mui.TextField;
var DatePicker = mui.DatePicker;
var FontIcon = mui.FontIcon;
var DropDownMenu = mui.DropDownMenu;

var DetailView = React.createClass({
  componentDidMount: function() {
    var self = this;

    setTimeout(function(){
      self.refs.Description.focus();
    }, 0);
  },

  formatDate: function(date) {
    return date;
  },

  render: function () {
    var today = new Date();

    var menuItemsCurrency = [
       { payload: '€', text: '€' },
       { payload: '$', text: '$' },
    ];

    return <Paper zDepth={1} innerClassName="expense-detail" rounded={false}>
      <TextField hintText="Description" ref="Description"/><br />
      <div className="expense-detail-item">
        <FontIcon className="md-local-atm"/>
        <TextField hintText="0.00" type="number"/>
        <DropDownMenu menuItems={menuItemsCurrency} />
      </div>
      <div className="expense-detail-item">
        <FontIcon className="md-schedule" />
        <DatePicker hintText="Date" defaultDate={today} formatDate={this.formatDate}/>
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
