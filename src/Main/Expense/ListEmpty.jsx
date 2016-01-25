import React from 'react';
import pure from 'recompose/pure';

// Waiting https://github.com/istarkov/babel-plugin-webpack-loaders/issues/4
// import expenseListEmptySvg from 'Main/Expense/ListEmpty.svg';
import expenseListEmptySvg from './ListEmpty.svg';
import TextIcon from 'Main/TextIcon';
import polyglot from 'polyglot';

const ExpenseListEmpty = React.createClass({
  render() {
    return (
      <TextIcon text={polyglot.t('expense_list_empty')} icon={expenseListEmptySvg} />
    );
  },
});

export default pure(ExpenseListEmpty);
