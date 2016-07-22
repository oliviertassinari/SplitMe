// @flow weak

import React from 'react';
import pure from 'recompose/pure';
import polyglot from 'polyglot';
import TextIcon from 'main/TextIcon';

import expenseListEmptySvg from './ListEmpty.svg';

const ExpenseListEmpty = () => (
  <TextIcon text={polyglot.t('expense_list_empty')} icon={expenseListEmptySvg} />
);

export default pure(ExpenseListEmpty);
