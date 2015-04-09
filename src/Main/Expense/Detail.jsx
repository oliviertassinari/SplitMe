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

var utils = require('../../utils');
var polyglot = require('../../polyglot');
var Avatar = require('../Avatar/View');
var List = require('../List/View');
var AmountField = require('../AmountField/View');
var PaidByDialog = require('./PaidByDialog');
var PaidFor = require('./PaidFor');

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
    return moment(date).format('dddd, ll'); // Thursday, April 9, 2015
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
       { payload: 'equaly', text: polyglot.t('split_equaly') },
       { payload: 'unequaly', text: polyglot.t('split_unequaly') },
       { payload: 'shares', text: polyglot.t('split_shares') },
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
                  {polyglot.t('paid_by')}
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
      paidBy = <TextField hintText={polyglot.t('paid_by')} onTouchTap={this.onTouchTapPaidBy}
        onFocus={this.onFocusPaidBy} />;
    }

    return <Paper zDepth={1} innerClassName="expense-detail" rounded={false}>
      <TextField hintText={polyglot.t('description')} ref="description" onBlur={this.onBlur}
        defaultValue={expense.description} onChange={this.onChangeDescription}/>
      <div className="expense-detail-item expense-detail-amount">
        <FontIcon className="md-local-atm" />
        <AmountField defaultValue={expense.amount} onChange={this.onChangeAmount} />
        <DropDownMenu menuItems={menuItemsCurrency} selectedIndex={currencyIndex}
          onChange={this.onChangeCurrency} />
      </div>
      <div className="expense-detail-item expense-detail-type">
        <FontIcon className="md-label" />
        <div className="expense-detail-item-content">
          {polyglot.t('expense_type')}
          <RadioButtonGroup name="type" defaultSelected={expense.type}>
            <RadioButton value="individual" label={polyglot.t('individual')} />
            <RadioButton value="group" label={polyglot.t('group')} disabled={true} />
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
      <div className="expense-detail-item">
        <FontIcon className="md-today" />
        <DatePicker hintText="Date" ref="datePicker" defaultDate={date} formatDate={this.formatDate}
          onShow={this.onShowDatePicker} onDismiss={this.onDismiss} onChange={this.onChangeDate} />
      </div>
      <PaidByDialog ref="paidByDialog" members={members.array}
        selected={paidByContact} onChange={this.onChangePaidBy}
        onDismiss={this.onDismiss} />
    </Paper>;
  }
});

module.exports = DetailView;
