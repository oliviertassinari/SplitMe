'use strict';

var React = require('react');
var Immutable = require('immutable');
var _ = require('underscore');
var moment = require('moment');
var Paper = require('material-ui/lib/paper');
var TextField = require('material-ui/lib/text-field');
var DatePicker = require('material-ui/lib/date-picker/date-picker');
var SelectField = require('material-ui/lib/select-field');
var ListItem = require('material-ui/lib/lists/list-item');
var IconATM = require('material-ui/lib/svg-icons/maps/local-atm');
var IconAccountBox = require('material-ui/lib/svg-icons/action/account-box');
var IconPerson = require('material-ui/lib/svg-icons/social/person');
var IconEqualizer = require('material-ui/lib/svg-icons/av/equalizer');
var IconPeople = require('material-ui/lib/svg-icons/social/people');
var IconToday = require('material-ui/lib/svg-icons/action/today');

var locale = require('locale');
var polyglot = require('polyglot');
var pageAction = require('Main/pageAction');
var AmountField = require('Main/AmountField');
var PaidBy = require('Main/Expense/PaidBy');
var PaidFor = require('Main/Expense/PaidFor');
var RelatedAccount = require('Main/Expense/RelatedAccount');
var expenseAction = require('Main/Expense/action');

var styles = {
  flex: {
    display: 'flex',
  },
  listItemBody: {
    margin: '-16px 0 0',
  },
  fullWidth: {
    width: '100%',
  },
  currency: {
    marginLeft: 24,
  },
};

var ExpenseDetail = React.createClass({
  propTypes: {
    account: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    expense: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    pageDialog: React.PropTypes.string.isRequired,
  },
  mixins: [
    React.addons.PureRenderMixin,
  ],
  componentDidMount: function() {
    if (!this.props.expense.get('_id')) { // Not a new expense
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

    if (from !== to) {
      var datePickerDialog = this.refs.datePicker.refs.dialogWindow;

      // Prevent the dispatch inside a dispatch
      setTimeout(function() {
        if (from === 'datePicker') {
          datePickerDialog.dismiss();
        }

        if (to === 'datePicker') {
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
    expenseAction.changeCurrency(event.target.value);
  },
  onShowDatePicker: function() {
    pageAction.showDialog('datePicker');
  },
  onChangeDate: function(event, date) {
    expenseAction.changeDate(moment(date).format('YYYY-MM-DD'));
  },
  onChangeRelatedAccount: function(account) {
    pageAction.dismissDialog();
    expenseAction.changeRelatedAccount(account);
  },
  onChangePaidBy: function(member) {
    pageAction.dismissDialog();

    if (member) { // Not set if pick a new contact
      expenseAction.changePaidBy(member.get('id'));
    }
  },
  onDismiss: function() {
    pageAction.dismissDialog();
  },
  onChangeSplit: function(event) {
    expenseAction.changeSplit(event.target.value);
  },
  render: function() {
    var expense = this.props.expense;
    var account = this.props.account;

    var currencies = [
      'EUR',
      'USD',
      'GBP',
      'AUD',
      'IDR',
    ];

    var menuItemsCurrency = _.map(currencies, function(currency) {
      return {
        payload: currency,
        text: locale.currencyToString(currency),
      };
    });

    var date = moment(expense.get('date'), 'YYYY-MM-DD').toDate();

    var menuItemsSplit = [
      { payload: 'equaly', text: polyglot.t('split_equaly') },
      { payload: 'unequaly', text: polyglot.t('split_unequaly') },
      { payload: 'shares', text: polyglot.t('split_shares') },
    ];

    return <Paper rounded={false}>
        <ListItem disabled={true}>
          <TextField hintText={polyglot.t('expense_description_hint')} ref="description" onBlur={this.onBlur}
            defaultValue={expense.get('description')} onChange={this.onChangeDescription} fullWidth={true}
            className="testExpenseAddDescription" style={styles.listItemBody} floatingLabelText={polyglot.t('description')} />
        </ListItem>
        <ListItem disabled={true} leftIcon={<IconATM />}>
          <div style={_.extend({}, styles.flex, styles.listItemBody)}>
            <AmountField defaultValue={expense.get('amount')} onChange={this.onChangeAmount} style={styles.fullWidth}
              className="testExpenseAddAmount" />
            <SelectField menuItems={menuItemsCurrency} value={expense.get('currency')}
              onChange={this.onChangeCurrency} className="testExpenseAddCurrency" style={styles.currency} />
          </div>
        </ListItem>
        <ListItem disabled={true} leftIcon={<IconAccountBox />}>
          <RelatedAccount account={account} textFieldStyle={styles.listItemBody}
            pageDialog={this.props.pageDialog} onChange={this.onChangeRelatedAccount} />
        </ListItem>
        <ListItem disabled={true} leftIcon={<IconPerson />}>
          <PaidBy account={account} paidByContactId={expense.get('paidByContactId')}
            onChange={this.onChangePaidBy} pageDialog={this.props.pageDialog}
            textFieldStyle={styles.listItemBody} />
        </ListItem>
        <ListItem disabled={true} leftIcon={<IconEqualizer />}>
          <SelectField menuItems={menuItemsSplit} value={expense.get('split')}
            autoWidth={false} onChange={this.onChangeSplit} style={_.extend({}, styles.fullWidth, styles.listItemBody)} />
        </ListItem>
        <ListItem disabled={true} leftIcon={<IconPeople />}>
          <PaidFor
            members={account.get('members')} split={expense.get('split')} paidFor={expense.get('paidFor')}
            currency={expense.get('currency')} />
        </ListItem>
        <ListItem disabled={true} leftIcon={<IconToday />}>
          <DatePicker hintText="Date" ref="datePicker" defaultDate={date} formatDate={this.formatDate}
            onShow={this.onShowDatePicker} onDismiss={this.onDismiss} onChange={this.onChangeDate}
            textFieldStyle={_.extend({}, styles.fullWidth, styles.listItemBody)} />
        </ListItem>
      </Paper>;
  },
});

module.exports = ExpenseDetail;
