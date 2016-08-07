// @flow weak

import React from 'react';
import pure from 'recompose/pure';
import polyglot from 'polyglot';
import TextIcon from 'modules/components/TextIcon';
import accountListEmptySvg from './ListEmpty.svg';

const AccountListEmpty = () => (
  <TextIcon text={polyglot.t('account_list_empty')} icon={accountListEmptySvg} />
);

export default pure(AccountListEmpty);
