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

var PaidByDialog = require('./PaidByDialogView');
var List = require('../List/View');
var Avatar = require('../Avatar/View');
var PaidFor = require('./PaidForView');
var AmountField = require('../AmountField/View');

var action = require('../action');
var expenseAction = require('./action');

var DetailView = React.createClass({
  propTypes: {
    expense: React.PropTypes.object.isRequired,
    pageDialog: React.PropTypes.string.isRequired,
  },

  componentDidMount: function() {
    var self = this;

    setTimeout(function() {
      self.refs.description.focus();

      if ('production' === process.env.NODE_ENV) {
        cordova.plugins.Keyboard.show();
      }
    }, 0);
  },

  formatDate: function(date) {
    return moment(date).format('dddd, MMM D, YYYY');
  },

  onBlur: function() {
    if ('production' === process.env.NODE_ENV) {
      cordova.plugins.Keyboard.close();
    }
  },

  onChangeCurrency: function(event, key, item) {
    expenseAction.changeCurrency(item.payload);
  },

  onShowDate: function() {
    action.showDialog('datePicker');
  },

  onDismiss: function() {
    action.dismissDialog();
  },

  onTouchTapPaidBy: function(event) {
    event.preventDefault();
    action.showDialog('paidBy');
    this.refs.paidByDialog.show();
  },

  onChangePaidBy: function(contact) {
    action.dismissDialog();
    expenseAction.changePaidBy(contact);
  },

  onChangeSplit: function(event, key, item) {
    expenseAction.changeSplit(item.payload);
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

    var paidBy;
    var self = this;

    var showDialogPaidBy = false;

    switch(this.props.pageDialog) {
      case 'paidBy':
        showDialogPaidBy = true;
        break;
    }

    if(expense.paidBy) {
      var avatar = <Avatar name={expense.paidBy.name} />;
      paidBy = <List left={avatar} onTouchTap={this.onTouchTapPaidBy}>
                  {expense.paidBy.name}
                </List>;
    } else {
      paidBy = <TextField hintText="Paid by" onTouchTap={this.onTouchTapPaidBy}/>;
    }

    return <Paper zDepth={1} innerClassName="expense-detail" rounded={false}>
      <TextField hintText="Description" ref="description" onBlur={this.onBlur}
        defaultValue={expense.description} /><br />
      <div className="expense-detail-item expense-detail-amount">
        <FontIcon className="md-local-atm" />
        <AmountField defaultValue={expense.amount} />
        <DropDownMenu menuItems={menuItemsCurrency} selectedIndex={currencyIndex}
          onChange={this.onChangeCurrency} />
      </div>
      <div className="expense-detail-item">
        <FontIcon className="md-schedule" />
        <DatePicker hintText="Date" ref="datePicker" defaultDate={date} formatDate={this.formatDate}
          onShow={this.onShowDate} onDismiss={this.onDismiss} />
      </div>
      <div className="expense-detail-item expense-detail-type">
        <FontIcon className="md-label" />
        <div className="expense-detail-item-content">
          Expense type
          <RadioButtonGroup name="type" defaultSelected={expense.type}>
            <RadioButton value="individual" label="Individual" />
            <RadioButton value="group" label="Group" disabled={false} />
          </RadioButtonGroup>
        </div>
      </div>
      <div className="expense-detail-item">
        <FontIcon className="md-person" />
        {paidBy}
      </div>
      <div className="expense-detail-item">
        <FontIcon className="md-equalizer" />
        <DropDownMenu menuItems={menuItemsSplit} selectedIndex={splitIndex}
          autoWidth={true} onChange={this.onChangeSplit} />
      </div>
      <div className="expense-detail-item">
        <FontIcon className="md-people" />
        <PaidFor className="expense-detail-item-content"
          members={expense.account.members} split={expense.split} paidFor={expense.paidFor}
          currency={expense.currency} />
      </div>
      <PaidByDialog ref="paidByDialog" members={expense.account.members}
        selected={expense.paidBy} onChange={this.onChangePaidBy}
        onDismiss={this.onDismiss} />
    </Paper>;
  }
});

module.exports = DetailView;
