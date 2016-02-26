import React from 'react';
import pure from 'recompose/pure';

import polyglot from 'polyglot';
import TextIcon from 'Main/TextIcon';
import accountDebtsEmptySvg from 'Main/Account/DebtsEmpty.svg';

class AccountDebtsEmpty extends React.Component {
  render() {
    return (
      <TextIcon text={polyglot.t('account_debts_empty')} icon={accountDebtsEmptySvg} />
    );
  }
}

export default pure(AccountDebtsEmpty);
