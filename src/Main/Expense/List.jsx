'use strict';

var React = require('react');
var _ = require('underscore');
var moment = require('moment');
var Paper = require('material-ui/lib/paper');
var colors = require('material-ui/lib/styles/colors');

var polyglot = require('../../polyglot');
var utils = require('../../utils');
var locale = require('../../locale');
var API = require('../../API');
var List = require('../List');
var Avatar = require('../Avatar');
var action = require('./action');

var styles = {
  description: {
    fontSize: 12,
    lineHeight: '20px',
    color: colors.lightBlack,
  },
};

var ExpenseList = React.createClass({
  propTypes: {
    expenses: React.PropTypes.array.isRequired,
  },
  onTouchTapList: function(expense, event) {
    event.preventDefault();
    action.tapList(expense);
  },
  render: function () {
    var self = this;
    var expenses = this.props.expenses;

    // Wait loading for expenses
    if(!API.isExpensesFetched(expenses)) {
      return <div></div>;
    }

    expenses = _.sortBy(expenses, 'date').reverse();

    return <Paper zDepth={1} rounded={false}>
      {_.map(expenses, function (expense) {
        var amount = new locale.intl.NumberFormat(locale.current, { style: 'currency', currency: expense.currency })
          .format(expense.amount);
        var members = utils.getExpenseMembers(expense);
        var paidBy = members.hash[expense.paidByContactId];
        var date = moment(expense.date, 'YYYY-MM-DD').format('ll');
        var avatar = <Avatar contact={paidBy} />;

        return <List key={expense._id} left={avatar} right={amount}
                onTouchTap={self.onTouchTapList.bind(self, expense)}>
            {expense.description}
            <div style={styles.description}>
              {polyglot.t('paid_by_name', {name: utils.getDisplayName(paidBy)}) + ', '+ date}
            </div>
          </List>;
      })}
    </Paper>;
  },
});

module.exports = ExpenseList;
