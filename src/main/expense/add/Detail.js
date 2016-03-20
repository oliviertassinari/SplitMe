import React from 'react';
import pure from 'recompose/pure';
import Immutable from 'immutable';
import moment from 'moment';
import Paper from 'material-ui/src/paper';
import TextField from 'material-ui/src/text-field';
import DatePicker from 'material-ui/src/date-picker/date-picker';
import SelectField from 'material-ui/src/select-field';
import ListItem from 'material-ui/src/lists/list-item';
import IconATM from 'material-ui/src/svg-icons/maps/local-atm';
import IconAccountBox from 'material-ui/src/svg-icons/action/account-box';
import IconPerson from 'material-ui/src/svg-icons/social/person';
import IconEqualizer from 'material-ui/src/svg-icons/av/equalizer';
import IconPeople from 'material-ui/src/svg-icons/social/people';
import IconToday from 'material-ui/src/svg-icons/action/today';
import MenuItem from 'material-ui/src/menus/menu-item';
import {connect} from 'react-redux';

import locale from 'locale';
import polyglot from 'polyglot';
import screenActions from 'main/screen/actions';
import AmountField from 'main/AmountField';
import ExpensePaidBy from 'main/expense/add/PaidBy';
import ExpensePaidFor from 'main/expense/add/PaidFor';
import ExpenseRelatedAccount from 'main/expense/add/RelatedAccount';
import expenseActions from 'main/expense/add/actions';

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
  'THB',
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
    screenDialog: React.PropTypes.string.isRequired,
  };

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
    const from = this.props.screenDialog;
    const to = nextProps.screenDialog;

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

  handleChangeDescription = (event) => {
    this.props.dispatch(expenseActions.changeCurrent('description', event.target.value));
  };

  handleChangeAmount = (amount) => {
    this.props.dispatch(expenseActions.changeCurrent('amount', amount));
  };

  formatDate = (date) => {
    return locale.dateTimeFormat(locale.current, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date); // Thursday, April 9, 2015
  };

  handleChangeCurrency = (event, index, value) => {
    this.props.dispatch(expenseActions.changeCurrent('currency', value));
  };

  handleShowDatePicker = () => {
    this.props.dispatch(screenActions.showDialog('datePicker'));
  };

  handleDismissDatePicker = () => {
    if (this.props.screenDialog === 'datePicker') {
      this.props.dispatch(screenActions.dismissDialog());
    }
  };

  handleChangeDate = (event, date) => {
    this.props.dispatch(expenseActions.changeCurrent('date', moment(date).format('YYYY-MM-DD')));
  };

  handleChangeRelatedAccount = (account) => {
    this.props.dispatch(expenseActions.changeRelatedAccount(account));
  };

  handleChangePaidBy = (member) => {
    this.props.dispatch(expenseActions.changePaidBy(member.get('id')));
  };

  handleAddMemberPaidBy = (member) => {
    this.props.dispatch(expenseActions.addMember(member, true));
  };

  handleAddMemberPaidFor = (member) => {
    this.props.dispatch(expenseActions.addMember(member, false));
  };

  handleChangePaidFor = (split, value, index) => {
    this.props.dispatch(expenseActions.changePaidFor(split, value, index));
  };

  handleChangeSplit = (event, index, value) => {
    this.props.dispatch(expenseActions.changeCurrent('split', value));
  };

  render() {
    const {
      expense,
      account,
      accounts,
      screenDialog,
    } = this.props;

    const date = moment(expense.get('date'), 'YYYY-MM-DD').toDate();

    return (
      <Paper rounded={false}>
        <ListItem disabled={true}>
          <TextField
            hintText={polyglot.t('expense_description_hint')} ref="description"
            value={expense.get('description')} onChange={this.handleChangeDescription} fullWidth={true}
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
          <ExpenseRelatedAccount
            accounts={accounts} account={account} textFieldStyle={styles.listItemBody}
            onChange={this.handleChangeRelatedAccount} openDialog={screenDialog === 'relatedAccount'}
          />
        </ListItem>
        <ListItem disabled={true} leftIcon={<IconPerson />}>
          <ExpensePaidBy
            account={account} paidByContactId={expense.get('paidByContactId')}
            onChange={this.handleChangePaidBy} openDialog={screenDialog === 'paidBy'}
            textFieldStyle={styles.listItemBody} onAddMember={this.handleAddMemberPaidBy}
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
          <ExpensePaidFor
            members={account.get('members')} split={expense.get('split')} paidFor={expense.get('paidFor')}
            currency={expense.get('currency')} onChange={this.handleChangePaidFor}
            onAddMember={this.handleAddMemberPaidFor}
          />
        </ListItem>
        <ListItem disabled={true} leftIcon={<IconToday />}>
          <DatePicker
            ref="datePicker"
            hintText="Date"
            defaultDate={date}
            formatDate={this.formatDate}
            onShow={this.handleShowDatePicker}
            onDismiss={this.handleDismissDatePicker}
            onChange={this.handleChangeDate}
            textFieldStyle={Object.assign({}, styles.fullWidth, styles.listItemBody)}
            locale={locale.current}
            DateTimeFormat={locale.dateTimeFormat}
            firstDayOfWeek={locale.data[locale.current].firstDayOfWeek}
            okLabel={polyglot.t('ok')}
            cancelLabel={polyglot.t('cancel')}
          />
        </ListItem>
      </Paper>
    );
  }
}

export default pure(connect()(ExpenseDetail));
