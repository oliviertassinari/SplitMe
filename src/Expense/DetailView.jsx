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
var utils = require('../utils');

var action = require('../action');
var expenseAction = require('./action');

var DetailView = React.createClass({
  propTypes: {
    expense: React.PropTypes.object.isRequired,
    pageDialog: React.PropTypes.string.isRequired,
  },
  componentDidMount: function() {
    if(!this.props.expense._id) { // Not a new expense
      var self = this;

      setTimeout(function() {
        self.refs.description.focus();

        if ('production' === process.env.NODE_ENV) {
          cordova.plugins.Keyboard.show();
        }
      }, 0);
    }
  },
  componentWillReceiveProps: function(nextProps) {
    if (nextProps.hasOwnProperty('pageDialog')) {
      this.updateDialog(this.props.pageDialog, nextProps.pageDialog);
    }
  },
  updateDialog: function(from, to) {
    if(from !== to) {
      this.dontAction = true;
      var paidbyDialog = this.refs.paidByDialog.refs.dialogWindow;
      var datePickerDialog = this.refs.datePicker.refs.dialogWindow;

      switch(from) {
        case 'datePicker':
          datePickerDialog.dismiss();
          break;

        case 'paidBy':
          paidbyDialog.dismiss();
          break;
      }

      switch(to) {
        case 'datePicker':
          datePickerDialog.show();
          break;

        case 'paidBy':
          paidbyDialog.show();
          break;
      }
      this.dontAction = false;
    }
  },
  onChangeDescription: function(event) {
    var self = this;

    // Wait to have value
    setTimeout(function() {
      expenseAction.changeDescription(self.refs.description.state.hasValue);
    }, 0);
  },
  onChangeAmount: function(amount) {
    expenseAction.changeAmount(amount);
  },
  formatDate: function(date) {
    return moment(date).format('dddd, MMM D YYYY');
  },
  onBlur: function() {
    if ('production' === process.env.NODE_ENV) {
      cordova.plugins.Keyboard.close();
    }
  },
  onChangeCurrency: function(event, key, item) {
    expenseAction.changeCurrency(item.payload);
  },
  onShowDatePicker: function() {
    action.showDialog('datePicker');
  },
  onChangeDate: function(event, date) {
    expenseAction.changeDate(moment(date).format('YYYY-MM-DD'));
  },
  onTouchTapPaidBy: function(event) {
    action.showDialog('paidBy');
  },
  onFocusPaidBy: function(event) {
    event.target.blur();
  },
  onChangePaidBy: function(contact) {
    action.dismissDialog();
    expenseAction.changePaidBy(contact.id);
  },
  onDismiss: function() {
    if(!this.dontAction) {
      action.dismissDialog();
    }
  },
  onChangeSplit: function(event, key, item) {
    expenseAction.changeSplit(item.payload);
  },
  render: function () {
    var expense = this.props.expense;

    var menuItemsCurrency = [
       { payload: 'EUR', text: utils.currencyMap.EUR },
       { payload: 'USD', text: utils.currencyMap.USD },
    ];

    var currencyIndex;

    _.each(menuItemsCurrency, function(item, index) {
      if(item.payload === expense.currency) {
        currencyIndex = index;
      }
    });

    var date = moment(expense.date, 'YYYY-MM-DD').toDate();

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

    var members = utils.getExpenseMembers(expense);

    var paidBy;
    var paidByContact = {};

    if(expense.paidByContactId) {
      paidByContact = members.hash[expense.paidByContactId];

      if(paidByContact) {
        var avatar = <Avatar contacts={[paidByContact]} />;
        paidBy = <div className="expense-detail-item-content">
                  Paid By
                  <List left={avatar} onTouchTap={this.onTouchTapPaidBy}
                    className="mui-menu-item">
                      {paidByContact.displayName}
                  </List>
                </div>;
      } else {
        paidByContact = {}; // Shouldn't be undefined
      }
    }

    if(!paidBy) {
      paidBy = <TextField hintText="Paid by" onTouchTap={this.onTouchTapPaidBy}
        onFocus={this.onFocusPaidBy} />;
    }

    return <Paper zDepth={1} innerClassName="expense-detail" rounded={false}>
      <TextField hintText="Description" ref="description" onBlur={this.onBlur}
        defaultValue={expense.description} onChange={this.onChangeDescription}/>
      <div className="expense-detail-item expense-detail-amount">
        <FontIcon className="md-local-atm" />
        <AmountField defaultValue={expense.amount} onChange={this.onChangeAmount} />
        <DropDownMenu menuItems={menuItemsCurrency} selectedIndex={currencyIndex}
          onChange={this.onChangeCurrency} />
      </div>
      <div className="expense-detail-item">
        <FontIcon className="md-today" />
        <DatePicker hintText="Date" ref="datePicker" defaultDate={date} formatDate={this.formatDate}
          onShow={this.onShowDatePicker} onDismiss={this.onDismiss} onChange={this.onChangeDate} />
      </div>
      <div className="expense-detail-item expense-detail-type">
        <FontIcon className="md-label" />
        <div className="expense-detail-item-content">
          Expense type
          <RadioButtonGroup name="type" defaultSelected={expense.type}>
            <RadioButton value="individual" label="Individual" />
            <RadioButton value="group" label="Group (not implemented yet)" disabled={true} />
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
          autoWidth={false} onChange={this.onChangeSplit} />
      </div>
      <div className="expense-detail-item">
        <FontIcon className="md-people" />
        <PaidFor className="expense-detail-item-content"
          members={members.array} split={expense.split} paidFor={expense.paidFor}
          currency={expense.currency} />
      </div>
      <PaidByDialog ref="paidByDialog" members={members.array}
        selected={paidByContact} onChange={this.onChangePaidBy}
        onDismiss={this.onDismiss} />
    </Paper>;
  }
});

module.exports = DetailView;
