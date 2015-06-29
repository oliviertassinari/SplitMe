'use strict';

var React = require('react');
var _ = require('underscore');
var moment = require('moment');
var Paper = require('material-ui/lib/paper');
var TextField = require('material-ui/lib/text-field');
var DatePicker = require('material-ui/lib/date-picker');
var SelectField = require('material-ui/lib/select-field');
var ListItem = require('material-ui/lib/lists/list-item');
var IconATM = require('material-ui/lib/svg-icons/maps/local-atm');
var IconAccountBox = require('material-ui/lib/svg-icons/action/account-box');
var IconPerson = require('material-ui/lib/svg-icons/social/person');
var IconEqualizer = require('material-ui/lib/svg-icons/av/equalizer');
var IconPeople = require('material-ui/lib/svg-icons/social/people');
var IconToday = require('material-ui/lib/svg-icons/action/today');
var StylePropable = require('material-ui/lib/mixins/style-propable');

var locale = require('locale');
var polyglot = require('polyglot');
var pageAction = require('Main/pageAction');
var AmountField = require('Main/AmountField');
var PaidBy = require('./PaidBy');
var PaidFor = require('./PaidFor');
var RelatedAccount = require('./RelatedAccount');
var expenseAction = require('./action');

var styles = {
  flex: {
    display: 'flex',
  },
  input: {
    margin: '-14px 0 0',
  },
  fullWidth: {
    width: '100%',
  },
};

var ExpenseDetail = React.createClass({
  propTypes: {
    expense: React.PropTypes.object.isRequired,
    pageDialog: React.PropTypes.string.isRequired,
  },
  mixins: [
    StylePropable,
  ],
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
      var datePickerDialog = this.refs.datePicker.refs.dialogWindow;

      // Prevent the dispatch inside a dispatch
      setTimeout(function() {
        if(from === 'datePicker') {
          datePickerDialog.dismiss();
        }

        if(to === 'datePicker') {
          datePickerDialog.show();
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
  onChangeCurrency: function(event) {
    expenseAction.changeCurrency(event.target.value.payload);
  },
  onShowDatePicker: function() {
    pageAction.showDialog('datePicker');
  },
  onChangeDate: function(event, date) {
    expenseAction.changeDate(moment(date).format('YYYY-MM-DD'));
  },
  onChangeRelatedAccount: function (account) {
    pageAction.dismissDialog();
    expenseAction.changeRelatedAccount(account);
  },
  onChangePaidBy: function(contact) {
    pageAction.dismissDialog();
    expenseAction.changePaidBy(contact.id);
  },
  onDismiss: function() {
    pageAction.dismissDialog();
  },
  onChangeSplit: function(event) {
    expenseAction.changeSplit(event.target.value.payload);
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

    return <Paper rounded={false}>
      <ListItem disabled={true}>
        <TextField hintText={polyglot.t('expense_description_hint')} ref="description" onBlur={this.onBlur}
          defaultValue={expense.description} onChange={this.onChangeDescription} fullWidth={true}
          className="testExpenseAddDescription" style={styles.input} floatingLabelText={polyglot.t('description')} />
      </ListItem>
      <ListItem disabled={true} leftIcon={<IconATM />}>
        <div style={this.mergeStyles(styles.flex, styles.input)}>
          <AmountField defaultValue={expense.amount} onChange={this.onChangeAmount} style={styles.fullWidth}
            className="testExpenseAddAmount" />
          <SelectField menuItems={menuItemsCurrency} value={currencyIndex}
            onChange={this.onChangeCurrency} className="testExpenseAddCurrency" />
        </div>
      </ListItem>
      <ListItem disabled={true} leftIcon={<IconAccountBox />}>
        <RelatedAccount account={expense.account} textFieldStyle={styles.input}
          pageDialog={this.props.pageDialog} onChange={this.onChangeRelatedAccount} />
      </ListItem>
      <ListItem disabled={true} leftIcon={<IconPerson />}>
        <PaidBy account={expense.account} paidByContactId={expense.paidByContactId}
          onChange={this.onChangePaidBy} pageDialog={this.props.pageDialog}
          textFieldStyle={styles.input} />
      </ListItem>
      <ListItem disabled={true} leftIcon={<IconEqualizer />}>
        <SelectField menuItems={menuItemsSplit} value={splitIndex}
          autoWidth={false} onChange={this.onChangeSplit} style={this.mergeStyles(styles.fullWidth, styles.input)} />
      </ListItem>
      <ListItem disabled={true} leftIcon={<IconPeople />}>
        <PaidFor
          members={expense.account.members} split={expense.split} paidFor={expense.paidFor}
          currency={expense.currency} />
      </ListItem>
      <ListItem disabled={true} leftIcon={<IconToday />}>
        <DatePicker hintText="Date" ref="datePicker" defaultDate={date} formatDate={this.formatDate}
          onShow={this.onShowDatePicker} onDismiss={this.onDismiss} onChange={this.onChangeDate}
          textFieldStyle={this.mergeStyles(styles.fullWidth, styles.input)} />
      </ListItem>
    </Paper>;
  }
});

module.exports = ExpenseDetail;
