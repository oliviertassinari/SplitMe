'use strict';

var React = require('react');
var Immutable = require('immutable');
var moment = require('moment');
var Paper = require('material-ui/lib/paper');
var colors = require('material-ui/lib/styles/colors');

var polyglot = require('polyglot');
var utils = require('utils');
var locale = require('locale');
var API = require('API');
var List = require('Main/List');
var MemberAvatar = require('Main/MemberAvatar');
var action = require('Main/Expense/action');

var styles = {
  description: {
    fontSize: 12,
    lineHeight: '20px',
    color: colors.lightBlack,
  },
};

var ExpenseList = React.createClass({
  propTypes: {
    account: React.PropTypes.instanceOf(Immutable.Map).isRequired,
  },
  mixins: [
    React.addons.PureRenderMixin,
  ],
  onTouchTapList: function(expense, event) {
    event.preventDefault();
    action.tapList(expense);
  },
  render: function () {
    var self = this;
    var account = this.props.account;
    var expenses = account.get('expenses');

    // Wait loading for expenses
    if(!API.isExpensesFetched(expenses)) {
      return <div />;
    }

    // DESC date order
    expenses = expenses.sort(function(expenseA, expenseB) {
        return expenseA.get('date') < expenseB.get('date');
      });

    return <Paper rounded={false}>
        {expenses.map(function(expense) {
          var amount = new locale.intl.NumberFormat(locale.current, {
            style: 'currency',
            currency: expense.get('currency'),
          }).format(expense.get('amount'));
          var paidBy = utils.getAccountMember(account, expense.get('paidByContactId'))[1];
          var date = moment(expense.get('date'), 'YYYY-MM-DD').format('ll');
          var avatar = <MemberAvatar member={paidBy} />;

          return <List key={expense.get('_id')} left={avatar} right={amount}
                  onTouchTap={self.onTouchTapList.bind(self, expense)}>
              {expense.get('description')}
              <div style={styles.description}>
                {polyglot.t('paid_by_name', {name: utils.getNameMember(paidBy)}) + ', ' + date}
              </div>
            </List>;
        })}
      </Paper>;
  },
});

module.exports = ExpenseList;
