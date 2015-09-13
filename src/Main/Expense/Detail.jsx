'use strict';

const React = require('react');
const PureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');
const Immutable = require('immutable');
const _ = require('underscore');
const moment = require('moment');
const Paper = require('material-ui/lib/paper');
const TextField = require('material-ui/lib/text-field');
const DatePicker = require('material-ui/lib/date-picker/date-picker');
const SelectField = require('material-ui/lib/select-field');
const ListItem = require('material-ui/lib/lists/list-item');
const IconATM = require('material-ui/lib/svg-icons/maps/local-atm');
const IconAccountBox = require('material-ui/lib/svg-icons/action/account-box');
const IconPerson = require('material-ui/lib/svg-icons/social/person');
const IconEqualizer = require('material-ui/lib/svg-icons/av/equalizer');
const IconPeople = require('material-ui/lib/svg-icons/social/people');
const IconToday = require('material-ui/lib/svg-icons/action/today');
const {connect} = require('react-redux');

const config = require('config');
const locale = require('locale');
const polyglot = require('polyglot');
const screenActions = require('Main/Screen/actions');
const AmountField = require('Main/AmountField');
const PaidBy = require('Main/Expense/PaidBy');
const PaidFor = require('Main/Expense/PaidFor');
const RelatedAccount = require('Main/Expense/RelatedAccount');
const expenseActions = require('Main/Expense/actions');
const contacts = require('contacts');

const styles = {
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

const styleItemSplit = _.extend({}, styles.fullWidth, styles.listItemBody);

const currencies = [
  'EUR',
  'USD',
  'GBP',
  'AUD',
  'IDR',
];

let menuItemsCurrency;;
let menuItemsSplit;

const ExpenseDetail = React.createClass({
  propTypes: {
    account: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    accounts: React.PropTypes.instanceOf(Immutable.List).isRequired,
    dispatch: React.PropTypes.func.isRequired,
    expense: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    pageDialog: React.PropTypes.string.isRequired,
  },
  mixins: [
    PureRenderMixin,
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
      const self = this;

      setTimeout(function() {
        self.refs.description.focus();

        if (config.platform === 'android') {
          cordova.plugins.Keyboard.show();
        }
      }, 0);
    }
  },
  componentWillUpdate: function(nextProps) {
    const from = this.props.pageDialog;
    const to = nextProps.pageDialog;

    if (from !== to) {
      const datePickerDialog = this.refs.datePicker.refs.dialogWindow;

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
    return locale.dateTimeFormat(locale.current, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date); // Thursday, April 9, 2015
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
    const dispatch = this.props.dispatch;

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
    contacts.pickContact()
      .then((contact) => {
        this.props.dispatch(expenseActions.pickContact(contact, false));
      });
  },
  onDismiss: function() {
    this.props.dispatch(screenActions.dismissDialog());
  },
  onChangeSplit: function(event) {
    this.props.dispatch(expenseActions.changeCurrent('split', event.target.value));
  },
  render: function() {
    const expense = this.props.expense;
    const account = this.props.account;
    const date = moment(expense.get('date'), 'YYYY-MM-DD').toDate();

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
