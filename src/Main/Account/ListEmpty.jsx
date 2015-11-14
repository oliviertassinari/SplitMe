import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import polyglot from 'polyglot';
import accountListEmptySvg from 'Main/Account/ListEmpty.svg';
import TextIcon from 'Main/TextIcon';

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
