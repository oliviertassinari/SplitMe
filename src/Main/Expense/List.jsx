import React from 'react';
import pure from 'recompose/pure';
import Immutable from 'immutable';
import {createSelector} from 'reselect';
import moment from 'moment';
import Paper from 'material-ui/src/paper';
import ListItem from 'material-ui/src/lists/list-item';
import ReactList from 'react-list';
import {connect} from 'react-redux';
import {routeActions} from 'redux-simple-router';

import polyglot from 'polyglot';
import locale from 'locale';
import API from 'API';
import accountUtils from 'Main/Account/utils';
import ListItemBody from 'Main/ListItemBody';
import MemberAvatar from 'Main/Member/Avatar';
import ExpenseListEmpty from 'Main/Expense/ListEmpty';

const styles = {
  // Fix for displaying element at the right of the ListItem
  avatar: {
    top: 16,
  },
  // End of fix
};

class ExpenseList extends React.Component {
  static propTypes = {
    account: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    dispatch: React.PropTypes.func.isRequired,
    expensesSorted: React.PropTypes.instanceOf(Immutable.List).isRequired,
  };

  onTouchTapList = (expense, event) => {
    event.preventDefault();

    setTimeout(() => {
      this.props.dispatch(routeActions.push(`/account/${
        API.accountRemovePrefixId(this.props.account.get('_id'))
        }/expense/${API.expenseRemovePrefixId(expense.get('_id'))}/edit`));
    }, 0);
  };

  renderItem = (index) => {
    const {
      account,
      expensesSorted,
    } = this.props;

    const expense = expensesSorted.get(index);

    const amount = locale.numberFormat(locale.current, {
      style: 'currency',
      currency: expense.get('currency'),
    }).format(expense.get('amount'));
    const date = locale.dateTimeFormat(locale.current, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(moment(expense.get('date'), 'YYYY-MM-DD')); // Sep 13, 2015
    const paidBy = accountUtils.getAccountMember(account, expense.get('paidByContactId'))[1];
    const avatar = <MemberAvatar member={paidBy} style={styles.avatar} />;

    return (
      <ListItem
        key={expense.get('_id')} leftAvatar={avatar} data-test="ListItem"
        onTouchTap={this.onTouchTapList.bind(this, expense)}
      >
        <ListItemBody
          title={expense.get('description')} right={amount}
          description={
            `${polyglot.t('paid_by_name', {name: accountUtils.getNameMember(paidBy)})}, ${date}`
          }
        />
      </ListItem>
    );
  };

  render() {
    const expenses = this.props.account.get('expenses');

    if (expenses.size === 0) {
      return <ExpenseListEmpty />;
    }

    // Wait loading for expenses
    if (!API.isExpensesFetched(expenses)) {
      return <div />;
    }

    return (
      <Paper rounded={false} data-test="ExpenseList">
        <ReactList
          itemRenderer={this.renderItem} length={expenses.size} type="simple"
          threshold={150}
          expenses={expenses} // Needed to rerender when expenses are updated
        />
      </Paper>
    );
  }
}

function getExpensesSorted(expenses) {
  // Can't sort
  if (!API.isExpensesFetched(expenses)) {
    return expenses;
  }

  // DESC date order
  return expenses.sort((expenseA, expenseB) => {
    if (expenseA.get('date') < expenseB.get('date')) {
      return 1;
    } else if (expenseA.get('date') === expenseB.get('date')) {
      return expenseA.get('dateCreated') < expenseB.get('dateCreated') ? 1 : -1;
    } else {
      return -1;
    }
  });
}

const expenseSortedSelector = createSelector(
  (state, props) => props.account.get('expenses'),
  (expenses) => {
    return {
      expensesSorted: getExpensesSorted(expenses),
    };
  }
);

export default connect(expenseSortedSelector)(pure(ExpenseList));
