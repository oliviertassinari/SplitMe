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
var Avatar = require('../Avatar');
var List = require('../List');
var AmountField = require('../AmountField');
var PaidByDialog = require('./PaidByDialog');
var PaidFor = require('./PaidFor');

var pageAction = require('../pageAction');
var expenseAction = require('./action');

var membersArray = [];

var styles = {
  root: {
    padding: '16px',
  },
  item: {
    display: 'flex',
  },
  itemIcon: {
    flexShrink: 0,
    width: '50px',
    marginTop: '12px',
  },
  itemContent: {
    marginTop: '14px',
    fontSize: '15px',
    flexGrow: 1,
  },
  fullWidth: {
    width: '100%',
    flexShrink: '20',
  },
  radioButton: {
    paddingTop: '6px',
  },
};

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
        paidBy = <div style={styles.itemContent}>
                  {polyglot.t('paid_by')}
                  <List left={avatar} onTouchTap={this.onTouchTapPaidBy} withoutMargin={true}>
                    {utils.getDisplayName(paidByContact)}
                  </List>
                </div>;
      }
    }

    if(!paidBy) {
      paidBy = <TextField hintText={polyglot.t('paid_by')} onTouchTap={this.onTouchTapPaidBy}
        onFocus={this.onFocusPaidBy} style={styles.fullWidth} />;
    }

    return <Paper zDepth={1} rounded={false} style={styles.root}>
      <TextField hintText={polyglot.t('description')} ref="description" onBlur={this.onBlur}
        defaultValue={expense.description} onChange={this.onChangeDescription} style={styles.fullWidth} />
      <div style={styles.item}>
        <FontIcon className="md-local-atm" style={styles.itemIcon} />
        <AmountField defaultValue={expense.amount} onChange={this.onChangeAmount} style={styles.fullWidth} />
        <DropDownMenu menuItems={menuItemsCurrency} selectedIndex={currencyIndex}
          onChange={this.onChangeCurrency} />
      </div>
      <div style={styles.item}>
        <FontIcon className="md-label" style={styles.itemIcon} />
        <div style={styles.itemContent}>
          {polyglot.t('expense_category')}
          <RadioButtonGroup name="category" defaultSelected={expense.category}>
            <RadioButton value="individual" label={polyglot.t('individual')} style={styles.radioButton} />
            <RadioButton value="group" label={polyglot.t('group')} style={styles.radioButton} disabled={true} />
          </RadioButtonGroup>
        </div>
      </div>
      <div style={styles.item}>
        <FontIcon className="md-person" style={styles.itemIcon} />
        {paidBy}
      </div>
      <div style={styles.item}>
        <FontIcon className="md-equalizer" style={styles.itemIcon} />
        <DropDownMenu menuItems={menuItemsSplit} selectedIndex={splitIndex}
          autoWidth={false} onChange={this.onChangeSplit} style={styles.fullWidth} />
      </div>
      <div style={styles.item}>
        <FontIcon className="md-people" style={styles.itemIcon} />
        <PaidFor style={styles.itemContent}
          members={members.array} split={expense.split} paidFor={expense.paidFor}
          currency={expense.currency} />
      </div>
      <div style={styles.item}>
        <FontIcon className="md-today" style={styles.itemIcon} />
        <DatePicker hintText="Date" ref="datePicker" defaultDate={date} formatDate={this.formatDate}
          onShow={this.onShowDatePicker} onDismiss={this.onDismiss} onChange={this.onChangeDate}
          style={styles.fullWidth} />
      </div>
      <PaidByDialog ref="paidByDialog" members={members.array}
        selected={paidByContactId} onChange={this.onChangePaidBy}
        onDismiss={this.onDismiss} />
    </Paper>;
  }
});

module.exports = ExpenseDetail;
