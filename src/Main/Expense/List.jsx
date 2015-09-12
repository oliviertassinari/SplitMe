'use strict';

const React = require('react');
const PureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');
const Immutable = require('immutable');
const moment = require('moment');
const Paper = require('material-ui/lib/paper');
const colors = require('material-ui/lib/styles/colors');
const ListItem = require('material-ui/lib/lists/list-item');
const ReactList = require('react-list');
const {connect} = require('react-redux');

const polyglot = require('polyglot');
const accountUtils = require('Main/Account/utils');
const locale = require('locale');
const API = require('API');
const MemberAvatar = require('Main/MemberAvatar');
const expenseActions = require('Main/Expense/actions');

const styles = {
  // Fix for displaying element at the right of the ListItem
  listItem: {
    display: 'flex',
  },
  avatar: {
    top: 16,
  },
  body: {
    flexGrow: 1,
  },
  description: {
    fontSize: 12,
    lineHeight: '20px',
    color: colors.lightBlack,
  },
  amount: {
    flexShrink: 0,
    wordBreak: 'break-word',
    maxWidth: '45%',
  },
  // End of fix
};

const ExpenseList = React.createClass({
  propTypes: {
    account: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    dispatch: React.PropTypes.func.isRequired,
  },
  mixins: [
    PureRenderMixin,
  ],
  getInitialState: function() {
    return {
      expensesSorted: this.getExpensesSorted(this.props.account.get('expenses')),
    };
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({
      expensesSorted: this.getExpensesSorted(nextProps.account.get('expenses')),
    });
  },
  getExpensesSorted: function(expenses) {
    // Can't sort
    if (!API.isExpensesFetched(expenses)) {
      return expenses;
    }

    // DESC date order
    return expenses.sort(function(expenseA, expenseB) {
      if (expenseA.get('date') < expenseB.get('date')) {
        return 1;
      } else if (expenseA.get('date') === expenseB.get('date')) {
        return expenseA.get('dateCreated') < expenseB.get('dateCreated') ? 1 : -1;
      } else {
        return -1;
      }
    });
  },
  onTouchTapList: function(expense, event) {
    event.preventDefault();

    setTimeout(() => {
      this.props.dispatch(expenseActions.tapList(expense));
    }, 0);
  },
  renderItem: function(index) {
    const account = this.props.account;
    const expense = this.state.expensesSorted.get(index);

    const amount = new locale.intl.NumberFormat(locale.current, {
      style: 'currency',
      currency: expense.get('currency'),
    }).format(expense.get('amount'));
    const paidBy = accountUtils.getAccountMember(account, expense.get('paidByContactId'))[1];
    const date = moment(expense.get('date'), 'YYYY-MM-DD').format('ll');
    const avatar = <MemberAvatar member={paidBy} style={styles.avatar} />;

    return <ListItem key={expense.get('_id')} leftAvatar={avatar} className="testList"
      onTouchTap={this.onTouchTapList.bind(this, expense)} innerDivStyle={styles.listItem}>
        <div style={styles.body} className="testExpenseList">
          {expense.get('description')}
          <div style={styles.description}>
            {polyglot.t('paid_by_name', {name: accountUtils.getNameMember(paidBy)}) + ', ' + date}
          </div>
        </div>
        <span style={styles.amount} className="testExpenseListAmount">{amount}</span>
      </ListItem>;
  },
  render: function() {
    const expenses = this.props.account.get('expenses');

    // Wait loading for expenses
    if (!API.isExpensesFetched(expenses)) {
      return <div />;
    }

    return <Paper rounded={false}>
        <ReactList itemRenderer={this.renderItem} length={expenses.size} type="simple" threshold={150}
          expenses={expenses} // Needed to rerender when expenses are updated
          />
      </Paper>;
  },
});

module.exports = connect()(ExpenseList);
