'use strict';

const React = require('react');
const PureRenderMixin = require('react-addons-pure-render-mixin');

const accountListEmptySvg = require('Main/Account/ListEmpty.svg');
const TextIcon = require('Main/TextIcon');
const polyglot = require('polyglot');

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

module.exports = AccountListEmpty;
