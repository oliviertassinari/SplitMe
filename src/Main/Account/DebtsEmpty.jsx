import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

// Waiting https://github.com/istarkov/babel-plugin-webpack-loaders/issues/4
// import accountDebtsEmptySvg from 'Main/Account/DebtsEmpty.svg';
import accountDebtsEmptySvg from './DebtsEmpty.svg';
import TextIcon from 'Main/TextIcon';
import polyglot from 'polyglot';

const AccountDebtsEmpty = React.createClass({
  mixins: [
    PureRenderMixin,
  ],
  render() {
    return (
      <TextIcon text={polyglot.t('account_debts_empty')} icon={accountDebtsEmptySvg} />
    );
  },
});

export default AccountDebtsEmpty;
