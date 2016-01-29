import React from 'react';
import pure from 'recompose/pure';
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
import MenuItem from 'material-ui/lib/menus/menu-item';
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
  'KRW',
  'JPY',
  'HKD',
];

let menuItemsCurrency;
let menuItemsSplit;

class ExpenseDetail extends React.Component {
  static propTypes = {
    account: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    accounts: React.PropTypes.instanceOf(Immutable.List).isRequired,
    dispatch: React.PropTypes.func.isRequired,
    expense: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    pageDialog: React.PropTypes.string.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.formatDate = this.formatDate.bind(this);
    this.handleChangeAmount = this.handleChangeAmount.bind(this);
    this.handleChangeCurrency = this.handleChangeCurrency.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleChangeDescription = this.handleChangeDescription.bind(this);
    this.handleChangePaidBy = this.handleChangePaidBy.bind(this);
    this.handleChangePaidFor = this.handleChangePaidFor.bind(this);
    this.handleChangeRelatedAccount = this.handleChangeRelatedAccount.bind(this);
    this.handleChangeSplit = this.handleChangeSplit.bind(this);
    this.handleDismissDatePicker = this.handleDismissDatePicker.bind(this);
    this.handlePickContactPaidBy = this.handlePickContactPaidBy.bind(this);
    this.handlePickContactPaidFor = this.handlePickContactPaidFor.bind(this);
    this.handleShowDatePicker = this.handleShowDatePicker.bind(this);
  }

  componentWillMount() {
    // wait locale to be loaded
    menuItemsCurrency = currencies.map((currency) => {
      return (
        <MenuItem
          value={currency}
          primaryText={locale.currencyToString(currency)}
          key={currency}
          data-test={`ExpenseAddCurrency${currency}`}
        />
      );
    });

    menuItemsSplit = [
      <MenuItem value="equaly" key="equaly" primaryText={polyglot.t('split_equaly')} />,
      <MenuItem value="unequaly" key="unequaly" primaryText={polyglot.t('split_unequaly')} />,
      <MenuItem value="shares" key="shares" primaryText={polyglot.t('split_shares')} />,
    ];
  }

  componentDidMount() {
    if (!this.props.expense.get('_id')) { // Not a new expense
      setTimeout(() => {
        this.refs.description.focus();

        if (process.env.PLATFORM === 'android') {
          cordova.plugins.Keyboard.show();
        }
      }, 0);
    }
  }

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
  }

  handleChangeDescription(event) {
    this.props.dispatch(expenseActions.changeCurrent('description', event.target.value));
  }

  handleChangeAmount(amount) {
    this.props.dispatch(expenseActions.changeCurrent('amount', amount));
  }

  formatDate(date) {
    return locale.dateTimeFormat(locale.current, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date); // Thursday, April 9, 2015
  }

  handleChangeCurrency(event, index, value) {
    this.props.dispatch(expenseActions.changeCurrent('currency', value));
  }

  handleShowDatePicker() {
    this.props.dispatch(screenActions.showDialog('datePicker'));
  }

  handleDismissDatePicker() {
    if (this.props.pageDialog === 'datePicker') {
      this.props.dispatch(screenActions.dismissDialog());
    }
  }

  handleChangeDate(event, date) {
    this.props.dispatch(expenseActions.changeCurrent('date', moment(date).format('YYYY-MM-DD')));
  }

  handleChangeRelatedAccount(account) {
    this.props.dispatch(expenseActions.changeRelatedAccount(account));
  }

  handleChangePaidBy(member) {
    this.props.dispatch(expenseActions.changePaidBy(member.get('id')));
  }

  handlePickContactPaidBy() {
    pluginContacts.pickContact()
      .then((contact) => {
        this.props.dispatch(expenseActions.pickContact(contact, true));
      });
  }

  handleChangePaidFor(paidFor) {
    this.props.dispatch(expenseActions.changeCurrent('paidFor', paidFor));
  }

  handlePickContactPaidFor() {
    pluginContacts.pickContact()
      .then((contact) => {
        this.props.dispatch(expenseActions.pickContact(contact, false));
      });
  }

  handleChangeSplit(event, index, value) {
    this.props.dispatch(expenseActions.changeCurrent('split', value));
  }

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
          <TextField
            hintText={polyglot.t('expense_description_hint')} ref="description"
            defaultValue={expense.get('description')} onChange={this.handleChangeDescription} fullWidth={true}
            data-test="ExpenseAddDescription" style={styles.listItemBody}
            floatingLabelText={polyglot.t('description')}
          />
        </ListItem>
        <ListItem disabled={true} leftIcon={<IconATM />}>
          <div style={Object.assign({}, styles.flex, styles.listItemBody)}>
            <AmountField value={expense.get('amount')} onChange={this.handleChangeAmount}
              style={styles.fullWidth} data-test="ExpenseAddAmount"
            />
            <SelectField value={expense.get('currency')}
              onChange={this.handleChangeCurrency} data-test="ExpenseAddCurrency" style={styles.currency}
            >
              {menuItemsCurrency}
            </SelectField>
          </div>
        </ListItem>
        <ListItem disabled={true} leftIcon={<IconAccountBox />}>
          <RelatedAccount
            accounts={accounts} account={account} textFieldStyle={styles.listItemBody}
            onChange={this.handleChangeRelatedAccount} openDialog={pageDialog === 'relatedAccount'}
          />
        </ListItem>
        <ListItem disabled={true} leftIcon={<IconPerson />}>
          <PaidBy
            account={account} paidByContactId={expense.get('paidByContactId')}
            onChange={this.handleChangePaidBy} openDialog={pageDialog === 'paidBy'}
            textFieldStyle={styles.listItemBody} onPickContact={this.handlePickContactPaidBy}
          />
        </ListItem>
        <ListItem disabled={true} leftIcon={<IconEqualizer />}>
          <SelectField
            value={expense.get('split')}
            autoWidth={false} onChange={this.handleChangeSplit} style={styleItemSplit}
          >
            {menuItemsSplit}
          </SelectField>
        </ListItem>
        <ListItem disabled={true} leftIcon={<IconPeople />}>
          <PaidFor
            members={account.get('members')} split={expense.get('split')} paidFor={expense.get('paidFor')}
            currency={expense.get('currency')} onChange={this.handleChangePaidFor}
            onPickContact={this.handlePickContactPaidFor}
          />
        </ListItem>
        <ListItem disabled={true} leftIcon={<IconToday />}>
          <DatePicker
            hintText="Date" ref="datePicker" defaultDate={date}
            formatDate={this.formatDate} onShow={this.handleShowDatePicker} onDismiss={this.handleDismissDatePicker}
            onChange={this.handleChangeDate} textFieldStyle={Object.assign({}, styles.fullWidth, styles.listItemBody)}
            locale={locale.current} DateTimeFormat={locale.dateTimeFormat}
            firstDayOfWeek={locale.data[locale.current].firstDayOfWeek}
          />
        </ListItem>
      </Paper>
    );
  }
}

export default connect()(pure(ExpenseDetail));
