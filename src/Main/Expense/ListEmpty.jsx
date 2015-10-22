'use strict';

const React = require('react');
const PureRenderMixin = require('react-addons-pure-render-mixin');

const expenseListEmptySvg = require('Main/Expense/ListEmpty.svg');
const TextIcon = require('Main/TextIcon');
const polyglot = require('polyglot');

const ExpenseListEmpty = React.createClass({
  mixins: [
    PureRenderMixin,
  ],
  render() {
    return (
      <TextIcon text={polyglot.t('expense_list_empty')} icon={expenseListEmptySvg} />
    );
  },
});

module.exports = ExpenseListEmpty;
