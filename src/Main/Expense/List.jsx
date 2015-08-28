'use strict';

var React = require('react');
var Immutable = require('immutable');
var moment = require('moment');
var Paper = require('material-ui/lib/paper');
var colors = require('material-ui/lib/styles/colors');
var ReactList = require('react-list');
var connect = require('react-redux').connect;

var polyglot = require('polyglot');
var utils = require('utils');
var locale = require('locale');
var API = require('API');
var List = require('Main/List');
var MemberAvatar = require('Main/MemberAvatar');
var expenseActions = require('Main/Expense/actions');

var styles = {
  description: {
    fontSize: 12,
    lineHeight: '20px',
    color: colors.lightBlack,
  },
};

var ExpenseList = React.createClass({
  propTypes: {
    account: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    dispatch: React.PropTypes.func.isRequired,
  },
  mixins: [
    React.addons.PureRenderMixin,
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
    var dispatch = this.props.dispatch;

    setTimeout(function() {
      dispatch(expenseActions.tapList(expense));
    }, 0);
  },
  renderItem: function(index) {
    var account = this.props.account;
    var expense = this.state.expensesSorted.get(index);

    var amount = new locale.intl.NumberFormat(locale.current, {
      style: 'currency',
      currency: expense.get('currency'),
    }).format(expense.get('amount'));
    var paidBy = utils.getAccountMember(account, expense.get('paidByContactId'))[1];
    var date = moment(expense.get('date'), 'YYYY-MM-DD').format('ll');
    var avatar = <MemberAvatar member={paidBy} />;

    return <List key={expense.get('_id')} left={avatar} right={amount} onTouchTap={this.onTouchTapList.bind(this, expense)}>
        {expense.get('description')}
        <div style={styles.description}>
          {polyglot.t('paid_by_name', {name: utils.getNameMember(paidBy)}) + ', ' + date}
        </div>
      </List>;
  },
  render: function() {
    var expenses = this.props.account.get('expenses');

    // Wait loading for expenses
    if (!API.isExpensesFetched(expenses)) {
      return <div />;
    }

    return <Paper rounded={false}>
        <ReactList itemRenderer={this.renderItem} length={expenses.size} type="uniform"
            expenses={expenses} // Needed to rerender when expenses are updated
          />
      </Paper>;
  },
});

module.exports = connect()(ExpenseList);
