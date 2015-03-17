'use strict';

var React = require('react');
var _ = require('underscore');
var mui = require('material-ui');
var Paper = mui.Paper;

var List = require('../List/View');
var Avatar = require('../Avatar/View');
var API = require('../API');
var action = require('./action');

var ListView = React.createClass({
  propTypes: {
    expenses: React.PropTypes.array.isRequired,
  },

  onTouchTapList: function(expense) {
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
        // var membersIn = {};

        // _.each(expense.accounts, function(account) {
        //   _.each(account.members, function(contact) {
        //       membersIn[contact.id] = contact;
        //   });
        // });

        // var left = <Avatar contacts={[membersIn[expense.paidByContactId]]} />;
        var left;
        var right = expense.amount + ' ' + expense.currency;

        return <Paper key={expense._id} zDepth={1} rounded={false}
                  onTouchTap={self.onTouchTapList.bind(self, expense)}>
                  <List left={left} right={right} className="mui-menu-item">
                    {expense.description}
                  </List>
              </Paper>;
      })}
    </div>;
  }
});

module.exports = ListView;
