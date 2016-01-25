import React from 'react';
import pure from 'recompose/pure';

import polyglot from 'polyglot';
// Waiting https://github.com/istarkov/babel-plugin-webpack-loaders/issues/4
// import accountListEmptySvg from 'Main/Account/ListEmpty.svg';
import accountListEmptySvg from './ListEmpty.svg';
import TextIcon from 'Main/TextIcon';

const AccountListEmpty = React.createClass({
  render() {
    return (
      <TextIcon text={polyglot.t('account_list_empty')} icon={accountListEmptySvg} />
    );
  },
});

export default pure(AccountListEmpty);
