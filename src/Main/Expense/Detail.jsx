'use strict';

var React = require('react');
var _ = require('underscore');
var moment = require('moment');
var Paper = require('material-ui/lib/paper');
var TextField = require('material-ui/lib/text-field');
var DatePicker = require('material-ui/lib/date-picker');
var FontIcon = require('material-ui/lib/font-icon');
var DropDownMenu = require('material-ui/lib/drop-down-menu');
var RadioButtonGroup = require('material-ui/lib/radio-button-group');
var RadioButton = require('material-ui/lib/radio-button');

var utils = require('../../utils');
var locale = require('../../locale');
var polyglot = require('../../polyglot');
var Avatar = require('../Avatar/Avatar');
var List = require('../List/List');
var AmountField = require('../AmountField/AmountField');
var PaidByDialog = require('./PaidByDialog');
var PaidFor = require('./PaidFor');

var pageAction = require('../pageAction');
var expenseAction = require('./action');

require('./detail.less');

var membersArray = [];

var ExpenseDetail = React.createClass({
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

  componentWillUpdate: function(nextProps) {
    var from = this.props.pageDialog;
    var to = nextProps.pageDialog;

    if(from !== to) {
      var paidbyDialog = this.refs.paidByDialog.refs.dialogWindow;
      var datePickerDialog = this.refs.datePicker.refs.dialogWindow;

      // Prevent the dispatch inside a dispatch
      setTimeout(function() {
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
      });
    }
  },
  onChangeDescription: function() {
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
    pageAction.showDialog('datePicker');
  },
  onChangeDate: function(event, date) {
    expenseAction.changeDate(moment(date).format('YYYY-MM-DD'));
  },
  onTouchTapPaidBy: function() {
    pageAction.showDialog('paidBy');
  },
  onFocusPaidBy: function(event) {
    event.target.blur();
  },
  onChangePaidBy: function(contact) {
    pageAction.dismissDialog();
    expenseAction.changePaidBy(contact.id);
  },
  onDismiss: function() {
    pageAction.dismissDialog();
  },
  onChangeSplit: function(event, key, item) {
    expenseAction.changeSplit(item.payload);
  },
  render: function () {
    var expense = this.props.expense;

    var currencies = [
      'EUR',
      'USD',
      'GBP',
      'AUD',
    ];

    var currencyIndex;
    var menuItemsCurrency = _.map(currencies, function(currency, index) {
      if(currency === expense.currency) {
        currencyIndex = index;
      }

      return {
        payload: currency,
        text: locale.currencyToString(currency),
      };
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

    // Allow faster rendering
    for (var i = 0; i < members.array.length; i++) {
      if(membersArray[i] && membersArray[i] === members.array[i]) {
        members.array = membersArray;
        break;
      }
    }

    membersArray = members.array;

    var paidBy;
    var paidByContactId = '';

    if(expense.paidByContactId) {
      var paidByContact = members.hash[expense.paidByContactId];

      if(paidByContact) {
        paidByContactId = paidByContact.id;

        var avatar = <Avatar contact={paidByContact} />;
        paidBy = <div className="expense-detail-item-content">
                  {polyglot.t('paid_by')}
                  <List left={avatar} onTouchTap={this.onTouchTapPaidBy}
                    className="mui-menu-item">
                      {paidByContact.displayName}
                  </List>
                </div>;
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
        selected={paidByContactId} onChange={this.onChangePaidBy}
        onDismiss={this.onDismiss} />
    </Paper>;
  }
});

module.exports = ExpenseDetail;
