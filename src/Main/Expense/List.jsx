'use strict';

const React = require('react');
const PureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');
const Immutable = require('immutable');
const reselect = require('reselect');
const moment = require('moment');
const Paper = require('material-ui/lib/paper');
const ListItem = require('material-ui/lib/lists/list-item');
const ReactList = require('react-list');
const {connect} = require('react-redux');

const polyglot = require('polyglot');
const accountUtils = require('Main/Account/utils');
const locale = require('locale');
const API = require('API');
const ListItemBody = require('Main/ListItemBody');
const MemberAvatar = require('Main/MemberAvatar');
const expenseActions = require('Main/Expense/actions');

const styles = {
  // Fix for displaying element at the right of the ListItem
  avatar: {
    top: 16,
  },
  // End of fix
};

const ExpenseList = React.createClass({
  propTypes: {
    account: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    dispatch: React.PropTypes.func.isRequired,
    expensesSorted: React.PropTypes.instanceOf(Immutable.List).isRequired,
  },
  mixins: [
    PureRenderMixin,
  ],
  statics: {
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
  },
  onTouchTapList: function(expense, event) {
    event.preventDefault();

    setTimeout(() => {
      this.props.dispatch(expenseActions.tapList(expense));
    }, 0);
  },
  renderItem: function(index) {
    const {
      account,
      expensesSorted,
    } = this.props;

    const expense = expensesSorted.get(index);

    const amount = new locale.intl.NumberFormat(locale.current, {
      style: 'currency',
      currency: expense.get('currency'),
    }).format(expense.get('amount'));
    const paidBy = accountUtils.getAccountMember(account, expense.get('paidByContactId'))[1];
    const date = moment(expense.get('date'), 'YYYY-MM-DD').format('ll');
    const avatar = <MemberAvatar member={paidBy} style={styles.avatar} />;

    return <ListItem key={expense.get('_id')} leftAvatar={avatar} className="testListItem"
      onTouchTap={this.onTouchTapList.bind(this, expense)}>
        <ListItemBody title={expense.get('description')} right={amount}
          description={polyglot.t('paid_by_name', {name: accountUtils.getNameMember(paidBy)}) + ', ' + date} />
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

const select = reselect.createSelector(
  (state, props) => props.account.get('expenses'),
  (expenses) => {
    return {
      expensesSorted: ExpenseList.getExpensesSorted(expenses),
    };
  }
);

module.exports = connect(select)(ExpenseList);
