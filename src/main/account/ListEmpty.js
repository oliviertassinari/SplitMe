import React from 'react';
import pure from 'recompose/pure';

import polyglot from 'polyglot';
import TextIcon from 'main/TextIcon';
import accountListEmptySvg from 'main/account/ListEmpty.svg';

const AccountListEmpty = () => (
  <TextIcon text={polyglot.t('account_list_empty')} icon={accountListEmptySvg} />
);

export default pure(AccountListEmpty);