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

var utils = require('utils');
var locale = require('locale');
var polyglot = require('polyglot');
var Avatar = require('Main/Avatar');
var List = require('Main/List');
var spacing = require('Main/spacing');
var pageAction = require('Main/pageAction');
var AmountField = require('Main/AmountField');
var PaidByDialog = require('./PaidByDialog');
var PaidFor = require('./PaidFor');
var expenseAction = require('./action');

var styles = {
  root: {
    padding: spacing.paperGutter,
  },
  item: {
    display: 'flex',
  },
  itemIcon: {
    flexShrink: 0,
    width: 50,
    marginTop: 12,
  },
  itemContent: {
    marginTop: 14,
    fontSize: 15,
    flexGrow: 1,
  },
  fullWidth: {
    width: '100%',
    flexShrink: 20,
  },
  radioButton: {
    paddingTop: 6,
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

        if (process.env.NODE_ENV === 'production') {
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
  onChangeDescription: function(event) {
    expenseAction.changeDescription(event.target.value);
  },
  onChangeAmount: function(amount) {
    expenseAction.changeAmount(amount);
  },
  formatDate: function(date) {
    return moment(date).format('dddd, ll'); // Thursday, April 9, 2015
  },
  onBlur: function() {
    if (process.env.NODE_ENV === 'production') {
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

    var paidBy;
    var paidByContactId = '';

    if(expense.paidByContactId) {
      var paidByContact = utils.getAccountMember(expense.account, expense.paidByContactId);

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
        onFocus={this.onFocusPaidBy} fullWidth={true} className="testExpenseAddPaidBy" />;
    }

    return <Paper rounded={false} style={styles.root}>
      <TextField hintText={polyglot.t('description')} ref="description" onBlur={this.onBlur}
        defaultValue={expense.description} onChange={this.onChangeDescription} fullWidth={true}
        className="testExpenseAddDescription" />
      <div style={styles.item}>
        <FontIcon className="md-local-atm" style={styles.itemIcon} />
        <AmountField defaultValue={expense.amount} onChange={this.onChangeAmount} style={styles.fullWidth}
          className="testExpenseAddAmount" />
        <DropDownMenu menuItems={menuItemsCurrency} selectedIndex={currencyIndex}
          onChange={this.onChangeCurrency} className="testExpenseAddCurrency" />
      </div>
      <div style={styles.item}>
        <FontIcon className="md-account-box" style={styles.itemIcon} />
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
          members={expense.account.members} split={expense.split} paidFor={expense.paidFor}
          currency={expense.currency} />
      </div>
      <div style={styles.item}>
        <FontIcon className="md-today" style={styles.itemIcon} />
        <DatePicker hintText="Date" ref="datePicker" defaultDate={date} formatDate={this.formatDate}
          onShow={this.onShowDatePicker} onDismiss={this.onDismiss} onChange={this.onChangeDate}
          style={styles.fullWidth} />
      </div>
      <PaidByDialog ref="paidByDialog" members={expense.account.members}
        selected={paidByContactId} onChange={this.onChangePaidBy}
        onDismiss={this.onDismiss} />
    </Paper>;
  }
});

module.exports = ExpenseDetail;
