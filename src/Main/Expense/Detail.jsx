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
var connect = require('react-redux').connect;

var config = require('config');
var locale = require('locale');
var polyglot = require('polyglot');
var screenActions = require('Main/Screen/actions');
var AmountField = require('Main/AmountField');
var PaidBy = require('Main/Expense/PaidBy');
var PaidFor = require('Main/Expense/PaidFor');
var RelatedAccount = require('Main/Expense/RelatedAccount');
var expenseActions = require('Main/Expense/actions');
var contacts = require('contacts');

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

var styleItemSplit = _.extend({}, styles.fullWidth, styles.listItemBody);

var currencies = [
  'EUR',
  'USD',
  'GBP',
  'AUD',
  'IDR',
];

var menuItemsCurrency;;
var menuItemsSplit;

var ExpenseDetail = React.createClass({
  propTypes: {
    account: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    accounts: React.PropTypes.instanceOf(Immutable.List).isRequired,
    dispatch: React.PropTypes.func.isRequired,
    expense: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    pageDialog: React.PropTypes.string.isRequired,
  },
  mixins: [
    React.addons.PureRenderMixin,
  ],
  componentWillMount: function() {
    // wait locale to be loaded
    menuItemsCurrency = _.map(currencies, function(currency) {
      return {
        payload: currency,
        text: locale.currencyToString(currency),
      };
    });
    menuItemsSplit = [
      { payload: 'equaly', text: polyglot.t('split_equaly') },
      { payload: 'unequaly', text: polyglot.t('split_unequaly') },
      { payload: 'shares', text: polyglot.t('split_shares') },
    ];
  },
  componentDidMount: function() {
    if (!this.props.expense.get('_id')) { // Not a new expense
      var self = this;

      setTimeout(function() {
        self.refs.description.focus();

        if (config.platform === 'android') {
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
      }, 0);
    }
  },
  onChangeDescription: function(event) {
    this.props.dispatch(expenseActions.changeCurrent('description', event.target.value));
  },
  onChangeAmount: function(amount) {
    this.props.dispatch(expenseActions.changeCurrent('amount', amount));
  },
  formatDate: function(date) {
    return moment(date).format('dddd, ll'); // Thursday, April 9, 2015
  },
  onBlur: function() {
    if (config.platform === 'android') {
      cordova.plugins.Keyboard.close();
    }
  },
  onChangeCurrency: function(event) {
    this.props.dispatch(expenseActions.changeCurrent('currency', event.target.value));
  },
  onShowDatePicker: function() {
    this.props.dispatch(screenActions.showDialog('datePicker'));
  },
  onChangeDate: function(event, date) {
    this.props.dispatch(expenseActions.changeCurrent('date', moment(date).format('YYYY-MM-DD')));
  },
  onChangeRelatedAccount: function(account) {
    this.props.dispatch(expenseActions.changeRelatedAccount(account));
  },
  onChangePaidBy: function(member) {
    this.props.dispatch(expenseActions.changePaidBy(member.get('id')));
  },
  onPickContactPaidBy: function() {
    var dispatch = this.props.dispatch;

    contacts.pickContact()
      .then(function(contact) {
        dispatch(expenseActions.pickContact(contact, true));
        dispatch(screenActions.dismissDialog());
      });
  },
  onChangePaidFor: function(paidFor) {
    this.props.dispatch(expenseActions.changeCurrent('paidFor', paidFor));
  },
  onPickContactPaidFor: function() {
    var dispatch = this.props.dispatch;

    contacts.pickContact()
      .then(function(contact) {
        dispatch(expenseActions.pickContact(contact, false));
      });
  },
  onDismiss: function() {
    this.props.dispatch(screenActions.dismissDialog());
  },
  onChangeSplit: function(event) {
    this.props.dispatch(expenseActions.changeCurrent('split', event.target.value));
  },
  render: function() {
    var expense = this.props.expense;
    var account = this.props.account;

    var date = moment(expense.get('date'), 'YYYY-MM-DD').toDate();

    return <Paper rounded={false}>
        <ListItem disabled={true}>
          <TextField hintText={polyglot.t('expense_description_hint')} ref="description" onBlur={this.onBlur}
            defaultValue={expense.get('description')} onChange={this.onChangeDescription} fullWidth={true}
            className="testExpenseAddDescription" style={styles.listItemBody}
            floatingLabelText={polyglot.t('description')} />
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
          <RelatedAccount accounts={this.props.accounts} account={account} textFieldStyle={styles.listItemBody}
            onChange={this.onChangeRelatedAccount} showDialog={this.props.pageDialog === 'relatedAccount'} />
        </ListItem>
        <ListItem disabled={true} leftIcon={<IconPerson />}>
          <PaidBy account={account} paidByContactId={expense.get('paidByContactId')}
            onChange={this.onChangePaidBy} showDialog={this.props.pageDialog === 'paidBy'}
            textFieldStyle={styles.listItemBody} onPickContact={this.onPickContactPaidBy} />
        </ListItem>
        <ListItem disabled={true} leftIcon={<IconEqualizer />}>
          <SelectField menuItems={menuItemsSplit} value={expense.get('split')}
            autoWidth={false} onChange={this.onChangeSplit} style={styleItemSplit} />
        </ListItem>
        <ListItem disabled={true} leftIcon={<IconPeople />}>
          <PaidFor members={account.get('members')} split={expense.get('split')} paidFor={expense.get('paidFor')}
            currency={expense.get('currency')} onChange={this.onChangePaidFor}
            onPickContact={this.onPickContactPaidFor} />
        </ListItem>
        <ListItem disabled={true} leftIcon={<IconToday />}>
          <DatePicker hintText="Date" ref="datePicker" defaultDate={date} formatDate={this.formatDate}
            onShow={this.onShowDatePicker} onDismiss={this.onDismiss} onChange={this.onChangeDate}
            textFieldStyle={_.extend({}, styles.fullWidth, styles.listItemBody)} />
        </ListItem>
      </Paper>;
  },
});

module.exports = connect()(ExpenseDetail);
