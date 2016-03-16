import React from 'react';
import pure from 'recompose/pure';

import polyglot from 'polyglot';
import TextIcon from 'main/TextIcon';
import expenseListEmptySvg from 'main/expense/ListEmpty.svg';

class ExpenseListEmpty extends React.Component {
  render() {
    return (
      <TextIcon text={polyglot.t('expense_list_empty')} icon={expenseListEmptySvg} />
    );
  }
}

export default pure(ExpenseListEmpty);
