'use strict';

var React = require('react');
var AppCanvas = require('material-ui/lib/app-canvas');
var AppBar = require('material-ui/lib/app-bar');

var ExpenseList = require('../Expense/List');
var MainActionButton = require('../MainActionButton');
var action = require('./action');

var AccountDetail = React.createClass({
  propTypes: {
    account: React.PropTypes.object.isRequired,
  },
  onTouchTapAddExpense: function(event) {
    event.preventDefault();
    action.tapAddExpenseForAccount(this.props.account);
  },
  onTouchTapClose: function(event) {
    event.preventDefault();
    action.tapClose();
  },
  render: function () {
    return <AppCanvas predefinedLayout={1}>
      <AppBar title={this.props.account.name}
        showMenuIconButton={true}
        iconClassNameLeft="md-close"
        onLeftIconButtonTouchTap={this.onTouchTapClose}>
      </AppBar>
      <div className="app-content-canvas">
        <ExpenseList expenses={this.props.account.expenses} />
      </div>
      <MainActionButton onTouchTap={this.onTouchTapAddExpense} />
    </AppCanvas>;
  },
});

module.exports = AccountDetail;
