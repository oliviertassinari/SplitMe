import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Immutable from 'immutable';
import moment from 'moment';
import Paper from 'material-ui/lib/paper';
import TextField from 'material-ui/lib/text-field';
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import SelectField from 'material-ui/lib/select-field';
import ListItem from 'material-ui/lib/lists/list-item';
import IconATM from 'material-ui/lib/svg-icons/maps/local-atm';
import IconAccountBox from 'material-ui/lib/svg-icons/action/account-box';
import IconPerson from 'material-ui/lib/svg-icons/social/person';
import IconEqualizer from 'material-ui/lib/svg-icons/av/equalizer';
import IconPeople from 'material-ui/lib/svg-icons/social/people';
import IconToday from 'material-ui/lib/svg-icons/action/today';
import {connect} from 'react-redux';

import locale from 'locale';
import polyglot from 'polyglot';
import screenActions from 'Main/Screen/actions';
import AmountField from 'Main/AmountField';
import PaidBy from 'Main/Expense/PaidBy';
import PaidFor from 'Main/Expense/PaidFor';
import RelatedAccount from 'Main/Expense/RelatedAccount';
import expenseActions from 'Main/Expense/actions';
import pluginContacts from 'plugin/contacts';

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

const styleItemSplit = Object.assign({}, styles.fullWidth, styles.listItemBody);

const currencies = [
  'EUR',
  'USD',
  'GBP',
  'AUD',
  'IDR',
];

let menuItemsCurrency;
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
  componentWillMount() {
    // wait locale to be loaded
    menuItemsCurrency = currencies.map((currency) => {
      return {
        payload: currency,
        text: locale.currencyToString(currency),
      };
    });
    menuItemsSplit = [
      {payload: 'equaly', text: polyglot.t('split_equaly')},
      {payload: 'unequaly', text: polyglot.t('split_unequaly')},
      {payload: 'shares', text: polyglot.t('split_shares')},
    ];
  },
  componentDidMount() {
    if (!this.props.expense.get('_id')) { // Not a new expense
      setTimeout(() => {
        this.refs.description.focus();

        if (PLATFORM === 'android') {
          cordova.plugins.Keyboard.show();
        }
      }, 0);
    }
  },
  componentWillUpdate(nextProps) {
    const from = this.props.pageDialog;
    const to = nextProps.pageDialog;

    if (from !== to) {
      const datePickerDialog = this.refs.datePicker.refs.dialogWindow;

      // Prevent the dispatch inside a dispatch
      setTimeout(() => {
        if (from === 'datePicker') {
          datePickerDialog.dismiss();
        }
      }, 0);
    }
  },
  onChangeDescription(event) {
    this.props.dispatch(expenseActions.changeCurrent('description', event.target.value));
  },
  onChangeAmount(amount) {
    this.props.dispatch(expenseActions.changeCurrent('amount', amount));
  },
  formatDate(date) {
    return locale.dateTimeFormat(locale.current, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date); // Thursday, April 9, 2015
  },
  onChangeCurrency(event) {
    this.props.dispatch(expenseActions.changeCurrent('currency', event.target.value));
  },
  onShowDatePicker() {
    this.props.dispatch(screenActions.showDialog('datePicker'));
  },
  onDismissDatePicker() {
    if (this.props.pageDialog === 'datePicker') {
      this.props.dispatch(screenActions.dismissDialog());
    }
  },
  onChangeDate(event, date) {
    this.props.dispatch(expenseActions.changeCurrent('date', moment(date).format('YYYY-MM-DD')));
  },
  onChangeRelatedAccount(account) {
    this.props.dispatch(expenseActions.changeRelatedAccount(account));
  },
  onChangePaidBy(member) {
    this.props.dispatch(expenseActions.changePaidBy(member.get('id')));
  },
  onPickContactPaidBy() {
    pluginContacts.pickContact()
      .then((contact) => {
        this.props.dispatch(expenseActions.pickContact(contact, true));
      });
  },
  onChangePaidFor(paidFor) {
    this.props.dispatch(expenseActions.changeCurrent('paidFor', paidFor));
  },
  onPickContactPaidFor() {
    pluginContacts.pickContact()
      .then((contact) => {
        this.props.dispatch(expenseActions.pickContact(contact, false));
      });
  },
  onChangeSplit(event) {
    this.props.dispatch(expenseActions.changeCurrent('split', event.target.value));
  },
  render() {
    const {
      expense,
      account,
      accounts,
      pageDialog,
    } = this.props;

    const date = moment(expense.get('date'), 'YYYY-MM-DD').toDate();

    return (
      <Paper rounded={false}>
        <ListItem disabled={true}>
          <TextField hintText={polyglot.t('expense_description_hint')} ref="description"
            defaultValue={expense.get('description')} onChange={this.onChangeDescription} fullWidth={true}
            data-test="ExpenseAddDescription" style={styles.listItemBody}
            floatingLabelText={polyglot.t('description')} />
        </ListItem>
        <ListItem disabled={true} leftIcon={<IconATM />}>
          <div style={Object.assign({}, styles.flex, styles.listItemBody)}>
            <AmountField defaultValue={expense.get('amount')} onChange={this.onChangeAmount} style={styles.fullWidth}
              data-test="ExpenseAddAmount" />
            <SelectField menuItems={menuItemsCurrency} value={expense.get('currency')}
              onChange={this.onChangeCurrency} data-test="ExpenseAddCurrency" style={styles.currency} />
          </div>
        </ListItem>
        <ListItem disabled={true} leftIcon={<IconAccountBox />}>
          <RelatedAccount accounts={accounts} account={account} textFieldStyle={styles.listItemBody}
            onChange={this.onChangeRelatedAccount} showDialog={pageDialog === 'relatedAccount'} />
        </ListItem>
        <ListItem disabled={true} leftIcon={<IconPerson />}>
          <PaidBy account={account} paidByContactId={expense.get('paidByContactId')}
            onChange={this.onChangePaidBy} showDialog={pageDialog === 'paidBy'}
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
            onShow={this.onShowDatePicker} onDismiss={this.onDismissDatePicker} onChange={this.onChangeDate}
            textFieldStyle={Object.assign({}, styles.fullWidth, styles.listItemBody)}
            locale={locale.current} DateTimeFormat={locale.dateTimeFormat} />
        </ListItem>
      </Paper>
    );
  },
});

export default connect()(ExpenseDetail);
