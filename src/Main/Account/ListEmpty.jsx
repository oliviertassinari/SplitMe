import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import accountListEmptySvg from 'Main/Account/ListEmpty.svg';
import TextIcon from 'Main/TextIcon';
import polyglot from 'polyglot';

const AccountListEmpty = React.createClass({
  mixins: [
    PureRenderMixin,
  ],
  render() {
    return (
      <TextIcon text={polyglot.t('account_list_empty')} icon={accountListEmptySvg} />
    );
  },
});

export default AccountListEmpty;
