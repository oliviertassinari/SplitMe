'use strict';

var React = require('react');
var _ = require('underscore');
var moment = require('moment');
var mui = require('material-ui');
var Paper = mui.Paper;
var TextField = mui.TextField;
var DatePicker = mui.DatePicker;
var FontIcon = mui.FontIcon;
var DropDownMenu = mui.DropDownMenu;
var RadioButtonGroup = mui.RadioButtonGroup;
var RadioButton = mui.RadioButton;

var DetailView = React.createClass({
  componentDidMount: function() {
    var self = this;

    setTimeout(function() {
      self.refs.Description.focus();

      if ("production" === process.env.NODE_ENV) {
        cordova.plugins.Keyboard.show();
      }
    }, 0);
  },

  formatDate: function(date) {
    return moment(date).format('dddd, MMM D, YYYY');
  },

  onBlur: function() {
    if ("production" === process.env.NODE_ENV) {
      cordova.plugins.Keyboard.close();
    }
  },

  render: function () {
    var expense = this.props.expense;

    var menuItemsCurrency = [
       { payload: 'EUR', text: '€' },
       { payload: 'USD', text: '$' },
    ];

    var currencyIndex;

    _.each(menuItemsCurrency, function(item, index) {
      if(item.payload === expense.currency) {
        currencyIndex = index;
      }
    });

    var date = moment(expense.date, 'l').toDate();

    var menuItemsSplit = [
       { payload: 'equaly', text: 'Split equaly' },
       { payload: 'unequaly', text: 'Split unequaly' },
       { payload: 'shares', text: 'Split by shares' },
    ];

    var splitIndex;

    _.each(menuItemsSplit, function(item, index) {
      if(item.payload === expense.split) {
        splitIndex = index;
      }
    });

    return <Paper zDepth={1} innerClassName="expense-detail" rounded={false}>
      <TextField hintText="Description" ref="Description" onBlur={this.onBlur}
        defaultValue={expense.description} /><br />
      <div className="expense-detail-item expense-detail-amount">
        <FontIcon className="md-local-atm"/>
        <TextField hintText="0.00" type="number" defaultValue={expense.amount} />
        <DropDownMenu menuItems={menuItemsCurrency} selectedIndex={currencyIndex} />
      </div>
      <div className="expense-detail-item">
        <FontIcon className="md-schedule" />
        <DatePicker hintText="Date" defaultDate={date} formatDate={this.formatDate} />
      </div>
      <div className="expense-detail-item">
        <FontIcon className="md-label" />
        <div className="expense-detail-item-content">
          Expense type
          <RadioButtonGroup
            name="shipSpeed"
            defaultSelected="individual">
              <RadioButton
                value="individual"
                label="Individual" />
             <RadioButton
                value="group"
                label="Group"
                disabled={false} />
          </RadioButtonGroup>
        </div>
      </div>
      <div className="expense-detail-item">
        <FontIcon className="md-person" />
      </div>
      <div className="expense-detail-item">
        <FontIcon className="md-equalizer" />
        <DropDownMenu menuItems={menuItemsSplit} selectedIndex={splitIndex} />
      </div>
      <div className="expense-detail-item">
        <FontIcon className="md-people" />
        <div className="expense-detail-item-content">
          For
        </div>
      </div>
    </Paper>;
  }
});

module.exports = DetailView;
