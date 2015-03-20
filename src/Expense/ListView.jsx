'use strict';

var React = require('react');
var _ = require('underscore');
var moment = require('moment');
var mui = require('material-ui');
var Paper = mui.Paper;

var List = require('../List/View');
var Avatar = require('../Avatar/View');
var API = require('../API');
var utils = require('../utils');
var action = require('./action');

var ListView = React.createClass({
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

    return <div>
      {_.map(expenses, function (expense) {
        var right = expense.amount + ' ' + utils.currencyMap[expense.currency];
        var members = utils.getExpenseMembers(expense);
        var paidBy = members.hash[expense.paidByContactId];
        var date = moment(expense.date, 'MM-DD-YYYY').format('MMM D, YYYY');
        var left = <Avatar contacts={[paidBy]} />;

        return <Paper key={expense._id} zDepth={1} rounded={false}
                  onTouchTap={self.onTouchTapList.bind(self, expense)}>
                  <List left={left} right={right} className="mui-menu-item">
                    {expense.description}
                    <div className="mui-font-style-caption">
                      {'Paid by ' + paidBy.displayName + ', '+ date}
                    </div>
                  </List>
              </Paper>;
      })}
    </div>;
  }
});

module.exports = ListView;
