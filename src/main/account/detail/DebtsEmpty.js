import React from 'react';
import pure from 'recompose/pure';

import polyglot from 'polyglot';
import TextIcon from 'main/TextIcon';

import accountDetailDebtsEmptySvg from './DebtsEmpty.svg';

const AccountDetailDebtsEmpty = () => (
  <TextIcon text={polyglot.t('account_debts_empty')} icon={accountDetailDebtsEmptySvg} />
);

export default pure(AccountDetailDebtsEmpty);
